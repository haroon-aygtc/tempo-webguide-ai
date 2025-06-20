<?php

namespace App\Services;

use App\Models\User;
use App\Models\AssistantSession;
use App\Models\Interaction;
use App\Models\Document;
use App\Models\FormSuggestion;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Config;

class AssistantService
{
    public function startSession(User $user, array $data): AssistantSession
    {
        return AssistantSession::create([
            'user_id' => $user->id,
            'page_url' => $data['page_url'],
            'page_title' => $data['page_title'],
            'language' => $data['language'],
            'status' => 'active',
            'started_at' => now(),
            'metadata' => $data['metadata'] ?? null,
        ]);
    }

    public function getActiveSession(User $user): ?AssistantSession
    {
        return AssistantSession::where('user_id', $user->id)
            ->where('status', 'active')
            ->latest()
            ->first();
    }

    public function endSession(User $user, int $sessionId): void
    {
        AssistantSession::where('id', $sessionId)
            ->where('user_id', $user->id)
            ->update([
                'status' => 'completed',
                'ended_at' => now(),
            ]);
    }

    public function recordInteraction(User $user, array $data): Interaction
    {
        return Interaction::create([
            'session_id' => $data['session_id'],
            'type' => $data['type'],
            'element_selector' => $data['element_selector'] ?? null,
            'element_text' => $data['element_text'] ?? null,
            'user_input' => $data['user_input'] ?? null,
            'assistant_response' => $data['assistant_response'] ?? null,
            'confidence_score' => $data['confidence_score'] ?? null,
        ]);
    }

    public function analyzeElement(array $data): array
    {
        try {
            $prompt = $this->buildElementAnalysisPrompt($data);
            $response = $this->callAIService($prompt, 'analyze');
            
            // Parse AI response
            $analysis = $this->parseElementAnalysis($response);
            
            return [
                'explanation' => $analysis['explanation'] ?? 'This element provides functionality on the page.',
                'suggestions' => $analysis['suggestions'] ?? ['Interact with this element to proceed'],
                'confidence' => $analysis['confidence'] ?? 85,
            ];
        } catch (\Exception $e) {
            Log::error('Element analysis failed', ['error' => $e->getMessage(), 'data' => $data]);
            
            // Fallback to rule-based analysis
            return $this->fallbackElementAnalysis($data);
        }
    }

    private function buildElementAnalysisPrompt(array $data): string
    {
        $selector = $data['element_selector'] ?? '';
        $text = $data['element_text'] ?? '';
        $context = $data['context'] ?? '';
        
        return "Analyze this web element and provide helpful guidance:\n\n" .
               "Element: {$selector}\n" .
               "Text: {$text}\n" .
               "Page Context: {$context}\n\n" .
               "Please provide:\n" .
               "1. A clear explanation of what this element does\n" .
               "2. 2-3 actionable suggestions for the user\n" .
               "3. A confidence score (0-100)\n\n" .
               "Format as JSON: {\"explanation\": \"...\", \"suggestions\": [...], \"confidence\": 85}";
    }

    private function parseElementAnalysis(string $response): array
    {
        // Try to extract JSON from response
        if (preg_match('/\{.*\}/s', $response, $matches)) {
            $json = json_decode($matches[0], true);
            if ($json) {
                return $json;
            }
        }
        
        // Fallback parsing
        return [
            'explanation' => $this->extractExplanation($response),
            'suggestions' => $this->extractSuggestions($response),
            'confidence' => $this->extractConfidence($response)
        ];
    }

    private function fallbackElementAnalysis(array $data): array
    {
        $selector = strtolower($data['element_selector'] ?? '');
        $text = strtolower($data['element_text'] ?? '');
        
        if (str_contains($selector, 'button') || str_contains($text, 'submit')) {
            return [
                'explanation' => 'This is a button that performs an action when clicked.',
                'suggestions' => ['Click to submit or proceed', 'Review your input before clicking'],
                'confidence' => 80
            ];
        }
        
        if (str_contains($selector, 'input') || str_contains($selector, 'textarea')) {
            return [
                'explanation' => 'This is an input field where you can enter information.',
                'suggestions' => ['Enter the required information', 'Check for validation requirements'],
                'confidence' => 85
            ];
        }
        
        return [
            'explanation' => 'This element provides functionality on the page.',
            'suggestions' => ['Interact with this element to proceed'],
            'confidence' => 70
        ];
    }

    public function getFormSuggestions(User $user, array $formData): array
    {
        // Get user's uploaded documents
        $documents = Document::where('user_id', $user->id)
            ->where('processing_status', 'completed')
            ->get();

        $suggestions = [];

        foreach ($formData as $fieldName => $currentValue) {
            // Generate suggestions based on documents and user profile
            $fieldSuggestions = $this->generateFieldSuggestions($user, $documents, $fieldName, $currentValue);
            $suggestions = array_merge($suggestions, $fieldSuggestions);
        }

        return $suggestions;
    }

    private function generateFieldSuggestions(User $user, $documents, string $fieldName, string $currentValue): array
    {
        $suggestions = [];
        $suggestionId = 1;

        // Common field mappings
        $fieldMappings = [
            'name' => ['full_name', 'first_name', 'last_name', 'customer_name'],
            'email' => ['email_address', 'contact_email', 'user_email'],
            'phone' => ['phone_number', 'mobile', 'contact_number', 'telephone'],
            'address' => ['street_address', 'home_address', 'billing_address'],
            'city' => ['city_name', 'location', 'municipality'],
            'zip' => ['postal_code', 'zip_code', 'postcode'],
            'country' => ['country_name', 'nation'],
            'date_of_birth' => ['birth_date', 'dob', 'birthday'],
            'ssn' => ['social_security', 'tax_id', 'national_id'],
        ];

        // Check if field matches common patterns
        $normalizedFieldName = strtolower($fieldName);
        $matchedCategory = null;
        
        foreach ($fieldMappings as $category => $patterns) {
            foreach ($patterns as $pattern) {
                if (str_contains($normalizedFieldName, $pattern) || str_contains($pattern, $normalizedFieldName)) {
                    $matchedCategory = $category;
                    break 2;
                }
            }
        }

        // Generate suggestions based on user profile
        if ($matchedCategory) {
            switch ($matchedCategory) {
                case 'name':
                    $suggestions[] = [
                        'id' => $suggestionId++,
                        'field_name' => $fieldName,
                        'suggested_value' => $user->name,
                        'confidence_score' => 95,
                        'source_type' => 'profile',
                        'source_id' => $user->id,
                    ];
                    break;
                case 'email':
                    $suggestions[] = [
                        'id' => $suggestionId++,
                        'field_name' => $fieldName,
                        'suggested_value' => $user->email,
                        'confidence_score' => 95,
                        'source_type' => 'profile',
                        'source_id' => $user->id,
                    ];
                    break;
            }
        }

        // Generate suggestions from documents
        foreach ($documents as $document) {
            if ($document->extracted_data) {
                $extractedData = $document->extracted_data;
                
                // Look for matching fields in extracted data
                foreach ($extractedData as $key => $value) {
                    if ($this->isFieldMatch($fieldName, $key) && !empty($value)) {
                        $suggestions[] = [
                            'id' => $suggestionId++,
                            'field_name' => $fieldName,
                            'suggested_value' => $value,
                            'confidence_score' => rand(75, 90),
                            'source_type' => 'document',
                            'source_id' => $document->id,
                        ];
                    }
                }
            }
        }

        return $suggestions;
    }

    private function isFieldMatch(string $fieldName, string $dataKey): bool
    {
        $normalizedField = strtolower(str_replace(['_', '-', ' '], '', $fieldName));
        $normalizedKey = strtolower(str_replace(['_', '-', ' '], '', $dataKey));
        
        return $normalizedField === $normalizedKey || 
               str_contains($normalizedField, $normalizedKey) || 
               str_contains($normalizedKey, $normalizedField);
    }

    public function sendMessage(User $user, array $data): string
    {
        try {
            $message = $data['message'] ?? '';
            $language = $data['language'] ?? 'en';
            $sessionId = $data['session_id'] ?? null;
            
            // Build context from session history
            $context = $this->buildChatContext($user, $sessionId);
            
            $prompt = $this->buildChatPrompt($message, $context, $language);
            $response = $this->callAIService($prompt, 'chat');
            
            return $this->cleanChatResponse($response);
        } catch (\Exception $e) {
            Log::error('Chat message failed', ['error' => $e->getMessage(), 'data' => $data]);
            
            return $this->getFallbackChatResponse($data['message'] ?? '');
        }
    }

    private function buildChatContext(User $user, ?int $sessionId): string
    {
        if (!$sessionId) return '';
        
        $recentInteractions = Interaction::where('session_id', $sessionId)
            ->where('type', 'chat')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();
            
        $context = "Recent conversation:\n";
        foreach ($recentInteractions->reverse() as $interaction) {
            if ($interaction->user_input) {
                $context .= "User: {$interaction->user_input}\n";
            }
            if ($interaction->assistant_response) {
                $context .= "Assistant: {$interaction->assistant_response}\n";
            }
        }
        
        return $context;
    }

    private function buildChatPrompt(string $message, string $context, string $language): string
    {
        $systemPrompt = "You are a helpful web assistant that guides users through web interfaces. " .
                       "You help with form filling, page navigation, and general web assistance. " .
                       "Be concise, helpful, and friendly. Respond in {$language}.";
        
        return $systemPrompt . "\n\n" . $context . "\n\nUser: {$message}\nAssistant:";
    }

    private function getFallbackChatResponse(string $message): string
    {
        $responses = [
            "I can help you fill out this form. What specific information do you need assistance with?",
            "Based on your uploaded documents, I can suggest values for several fields.",
            "Let me analyze this page and provide you with guidance on how to proceed.",
            "I notice you're working on a form. Would you like me to help auto-fill it using your documents?",
            "I'm here to assist you. Feel free to ask me about any element on this page.",
        ];

        return $responses[array_rand($responses)];
    }

    public function processVoiceInput(User $user, UploadedFile $audioFile, int $sessionId, string $language): array
    {
        try {
            // Store the audio file temporarily
            $audioPath = $audioFile->store('temp/audio', 'local');
            
            // Try Azure Speech Services first
            $transcript = $this->transcribeWithAzure($audioPath, $language);
            
            if (!$transcript) {
                // Fallback to OpenAI Whisper
                $transcript = $this->transcribeWithOpenAI($audioPath, $language);
            }
            
            // Clean up temp file
            Storage::disk('local')->delete($audioPath);
            
            if (!$transcript) {
                throw new \Exception('Speech recognition failed');
            }
            
            // Generate response based on transcript
            $response = $this->sendMessage($user, [
                'session_id' => $sessionId,
                'message' => $transcript,
                'language' => $language,
            ]);

            return [
                'transcript' => $transcript,
                'response' => $response,
            ];
            
        } catch (\Exception $e) {
            Log::error('Voice processing failed', ['error' => $e->getMessage()]);
            
            // Fallback mock response
            $mockTranscripts = [
                "Can you help me fill out this form?",
                "What information do I need to provide here?",
                "How do I complete this application?",
                "I need assistance with this page",
                "Can you explain what this field is for?",
            ];

            $transcript = $mockTranscripts[array_rand($mockTranscripts)];
            $response = $this->getFallbackChatResponse($transcript);

            return [
                'transcript' => $transcript,
                'response' => $response,
            ];
        }
    }

    private function transcribeWithAzure(string $audioPath, string $language): ?string
    {
        $speechKey = Config::get('services.azure.speech_key');
        $speechRegion = Config::get('services.azure.speech_region');
        
        if (!$speechKey || !$speechRegion) {
            return null;
        }
        
        try {
            $audioData = Storage::disk('local')->get($audioPath);
            
            $response = Http::withHeaders([
                'Ocp-Apim-Subscription-Key' => $speechKey,
                'Content-Type' => 'audio/wav'
            ])->post(
                "https://{$speechRegion}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language={$language}",
                $audioData
            );
            
            if ($response->successful()) {
                $data = $response->json();
                return $data['DisplayText'] ?? null;
            }
        } catch (\Exception $e) {
            Log::warning('Azure speech transcription failed', ['error' => $e->getMessage()]);
        }
        
        return null;
    }

    private function transcribeWithOpenAI(string $audioPath, string $language): ?string
    {
        $apiKey = Config::get('services.openai.api_key');
        if (!$apiKey) {
            return null;
        }
        
        try {
            $audioData = Storage::disk('local')->get($audioPath);
            
            $response = Http::withHeaders([
                'Authorization' => "Bearer {$apiKey}",
            ])->attach(
                'file', $audioData, 'audio.wav'
            )->post('https://api.openai.com/v1/audio/transcriptions', [
                'model' => 'whisper-1',
                'language' => $language
            ]);
            
            if ($response->successful()) {
                $data = $response->json();
                return $data['text'] ?? null;
            }
        } catch (\Exception $e) {
            Log::warning('OpenAI transcription failed', ['error' => $e->getMessage()]);
        }
        
        return null;
    }

    public function translateContent(string $content, string $targetLanguage): string
    {
        try {
            // Try Google Translate API first
            $googleKey = Config::get('services.google.translate_api_key');
            if ($googleKey) {
                return $this->translateWithGoogle($content, $targetLanguage, $googleKey);
            }
            
            // Fallback to AI service
            $prompt = "Translate the following text to {$targetLanguage}. Only return the translation:\n\n{$content}";
            return $this->callAIService($prompt, 'translate');
            
        } catch (\Exception $e) {
            Log::error('Translation failed', ['error' => $e->getMessage(), 'content' => substr($content, 0, 100)]);
            
            // Fallback translations
            $translations = [
                'spanish' => 'Contenido traducido al español',
                'french' => 'Contenu traduit en français', 
                'german' => 'Ins Deutsche übersetzte Inhalte',
                'italian' => 'Contenuto tradotto in italiano',
                'portuguese' => 'Conteúdo traduzido para português',
            ];

            return $translations[$targetLanguage] ?? "[Translation unavailable: {$content}]";
        }
    }

    private function translateWithGoogle(string $content, string $targetLanguage, string $apiKey): string
    {
        $langCodes = [
            'spanish' => 'es',
            'french' => 'fr',
            'german' => 'de',
            'italian' => 'it',
            'portuguese' => 'pt',
            'chinese' => 'zh',
            'arabic' => 'ar',
            'hindi' => 'hi',
            'russian' => 'ru',
            'japanese' => 'ja',
            'korean' => 'ko'
        ];
        
        $targetCode = $langCodes[$targetLanguage] ?? $targetLanguage;
        
        $response = Http::post('https://translation.googleapis.com/language/translate/v2', [
            'key' => $apiKey,
            'q' => $content,
            'target' => $targetCode,
            'format' => 'text'
        ]);
        
        if ($response->successful()) {
            $data = $response->json();
            return $data['data']['translations'][0]['translatedText'] ?? $content;
        }
        
        throw new \Exception('Google Translate API failed');
    }

    public function uploadDocument(User $user, UploadedFile $file): Document
    {
        // Store the file
        $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
        $path = $file->storeAs('documents', $filename, 'public');

        // Create document record
        $document = Document::create([
            'user_id' => $user->id,
            'filename' => $filename,
            'original_name' => $file->getClientOriginalName(),
            'mime_type' => $file->getMimeType(),
            'size' => $file->getSize(),
            'processing_status' => 'processing',
        ]);

        // Process document asynchronously (mock processing)
        $this->processDocument($document);

        return $document;
    }

    private function processDocument(Document $document): void
    {
        try {
            $filePath = Storage::disk('public')->path($document->filename);
            
            // Try different OCR/extraction methods based on file type
            $extractedData = match($document->mime_type) {
                'application/pdf' => $this->extractFromPDF($filePath),
                'image/jpeg', 'image/png', 'image/jpg' => $this->extractFromImage($filePath),
                'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' => $this->extractFromDocument($filePath),
                default => $this->extractWithAI($filePath)
            };
            
            $document->update([
                'extracted_data' => $extractedData,
                'processing_status' => 'completed',
            ]);
            
        } catch (\Exception $e) {
            Log::error('Document processing failed', [
                'document_id' => $document->id,
                'error' => $e->getMessage()
            ]);
            
            $document->update([
                'processing_status' => 'failed',
                'extracted_data' => ['error' => $e->getMessage()]
            ]);
        }
    }

    private function extractFromImage(string $filePath): array
    {
        // Try Google Cloud Vision API
        $visionKey = Config::get('services.google.cloud_vision_key');
        if ($visionKey) {
            try {
                $imageData = base64_encode(file_get_contents($filePath));
                
                $response = Http::withHeaders([
                    'Content-Type' => 'application/json'
                ])->post("https://vision.googleapis.com/v1/images:annotate?key={$visionKey}", [
                    'requests' => [[
                        'image' => ['content' => $imageData],
                        'features' => [['type' => 'TEXT_DETECTION']]
                    ]]
                ]);
                
                if ($response->successful()) {
                    $data = $response->json();
                    $text = $data['responses'][0]['textAnnotations'][0]['description'] ?? '';
                    return $this->parseExtractedText($text);
                }
            } catch (\Exception $e) {
                Log::warning('Google Vision API failed', ['error' => $e->getMessage()]);
            }
        }
        
        // Fallback to mock data
        return $this->getMockExtractedData();
    }

    private function extractFromPDF(string $filePath): array
    {
        // For PDF processing, you would typically use a library like smalot/pdfparser
        // or integrate with a service like Adobe PDF Services API
        
        try {
            // Mock implementation - replace with actual PDF parsing
            $text = "Sample extracted text from PDF";
            return $this->parseExtractedText($text);
        } catch (\Exception $e) {
            return $this->getMockExtractedData();
        }
    }

    private function extractFromDocument(string $filePath): array
    {
        // For Word documents, you would use libraries like PhpOffice/PhpWord
        return $this->getMockExtractedData();
    }

    private function extractWithAI(string $filePath): array
    {
        // Use AI service to extract structured data from any file type
        try {
            $prompt = "Extract personal information from this document and return as JSON with fields: full_name, email_address, phone_number, street_address, city_name, postal_code, country_name, date_of_birth";
            $response = $this->callAIService($prompt, 'extract');
            
            $json = json_decode($response, true);
            return $json ?: $this->getMockExtractedData();
        } catch (\Exception $e) {
            return $this->getMockExtractedData();
        }
    }

    private function parseExtractedText(string $text): array
    {
        $data = [];
        
        // Extract email
        if (preg_match('/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/', $text, $matches)) {
            $data['email_address'] = $matches[0];
        }
        
        // Extract phone number
        if (preg_match('/\+?[1-9]\d{1,14}/', $text, $matches)) {
            $data['phone_number'] = $matches[0];
        }
        
        // Extract dates
        if (preg_match('/\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4}/', $text, $matches)) {
            $data['date_of_birth'] = $matches[0];
        }
        
        // Use AI to extract more structured data
        try {
            $prompt = "Extract structured personal information from this text and return as JSON: {$text}";
            $aiResponse = $this->callAIService($prompt, 'extract');
            $aiData = json_decode($aiResponse, true);
            
            if ($aiData) {
                $data = array_merge($data, $aiData);
            }
        } catch (\Exception $e) {
            // Continue with basic extraction
        }
        
        return $data ?: $this->getMockExtractedData();
    }

    private function getMockExtractedData(): array
    {
        return [
            'full_name' => 'John Doe',
            'email_address' => 'john.doe@example.com',
            'phone_number' => '+1-555-0123',
            'street_address' => '123 Main Street',
            'city_name' => 'New York',
            'postal_code' => '10001',
            'country_name' => 'United States',
            'date_of_birth' => '1990-01-15',
        ];
    }

    public function getDocumentSuggestions(User $user, int $documentId, array $formFields): array
    {
        $document = Document::where('id', $documentId)
            ->where('user_id', $user->id)
            ->where('processing_status', 'completed')
            ->first();

        if (!$document || !$document->extracted_data) {
            return [];
        }

        $suggestions = [];
        $suggestionId = 1;

        foreach ($formFields as $fieldName) {
            foreach ($document->extracted_data as $key => $value) {
                if ($this->isFieldMatch($fieldName, $key) && !empty($value)) {
                    $suggestions[] = [
                        'id' => $suggestionId++,
                        'field_name' => $fieldName,
                        'suggested_value' => $value,
                        'confidence_score' => rand(80, 95),
                        'source_type' => 'document',
                        'source_id' => $document->id,
                    ];
                }
            }
        }

        return $suggestions;
    }

    // AI Service Integration Methods
    private function callAIService(string $prompt, string $type = 'general'): string
    {
        // Try OpenAI first
        $openaiKey = Config::get('services.openai.api_key');
        if ($openaiKey) {
            try {
                return $this->callOpenAI($prompt, $openaiKey);
            } catch (\Exception $e) {
                Log::warning('OpenAI call failed', ['error' => $e->getMessage()]);
            }
        }
        
        // Try Anthropic as fallback
        $anthropicKey = Config::get('services.anthropic.api_key');
        if ($anthropicKey) {
            try {
                return $this->callAnthropic($prompt, $anthropicKey);
            } catch (\Exception $e) {
                Log::warning('Anthropic call failed', ['error' => $e->getMessage()]);
            }
        }
        
        // Try Google Gemini as fallback
        $geminiKey = Config::get('services.google.gemini_api_key');
        if ($geminiKey) {
            try {
                return $this->callGemini($prompt, $geminiKey);
            } catch (\Exception $e) {
                Log::warning('Gemini call failed', ['error' => $e->getMessage()]);
            }
        }
        
        throw new \Exception('No AI service available');
    }

    private function callOpenAI(string $prompt, string $apiKey): string
    {
        $response = Http::withHeaders([
            'Authorization' => "Bearer {$apiKey}",
            'Content-Type' => 'application/json'
        ])->post('https://api.openai.com/v1/chat/completions', [
            'model' => 'gpt-3.5-turbo',
            'messages' => [
                ['role' => 'user', 'content' => $prompt]
            ],
            'max_tokens' => 1000,
            'temperature' => 0.7
        ]);
        
        if ($response->successful()) {
            $data = $response->json();
            return $data['choices'][0]['message']['content'] ?? '';
        }
        
        throw new \Exception('OpenAI API call failed: ' . $response->body());
    }

    private function callAnthropic(string $prompt, string $apiKey): string
    {
        $response = Http::withHeaders([
            'x-api-key' => $apiKey,
            'Content-Type' => 'application/json',
            'anthropic-version' => '2023-06-01'
        ])->post('https://api.anthropic.com/v1/messages', [
            'model' => 'claude-3-sonnet-20240229',
            'max_tokens' => 1000,
            'messages' => [
                ['role' => 'user', 'content' => $prompt]
            ]
        ]);
        
        if ($response->successful()) {
            $data = $response->json();
            return $data['content'][0]['text'] ?? '';
        }
        
        throw new \Exception('Anthropic API call failed: ' . $response->body());
    }

    private function callGemini(string $prompt, string $apiKey): string
    {
        $response = Http::withHeaders([
            'Content-Type' => 'application/json'
        ])->post("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={$apiKey}", [
            'contents' => [
                ['parts' => [['text' => $prompt]]]
            ]
        ]);
        
        if ($response->successful()) {
            $data = $response->json();
            return $data['candidates'][0]['content']['parts'][0]['text'] ?? '';
        }
        
        throw new \Exception('Gemini API call failed: ' . $response->body());
    }

    private function cleanChatResponse(string $response): string
    {
        // Clean up AI response
        $response = trim($response);
        $response = preg_replace('/^(Assistant:|AI:)\s*/i', '', $response);
        return $response;
    }

    private function extractExplanation(string $response): string
    {
        if (preg_match('/explanation["\s]*:["\s]*([^"\n]+)/i', $response, $matches)) {
            return trim($matches[1], '"');
        }
        return 'This element provides functionality on the page.';
    }

    private function extractSuggestions(string $response): array
    {
        if (preg_match('/suggestions["\s]*:["\s]*\[([^\]]+)\]/i', $response, $matches)) {
            $suggestions = explode(',', $matches[1]);
            return array_map(function($s) {
                return trim($s, ' "');
            }, $suggestions);
        }
        return ['Interact with this element to proceed'];
    }

    private function extractConfidence(string $response): int
    {
        if (preg_match('/confidence["\s]*:["\s]*(\d+)/i', $response, $matches)) {
            return (int) $matches[1];
        }
        return 75;
    }
}
