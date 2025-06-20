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
        // Mock AI analysis - replace with actual AI service integration
        $confidence = rand(70, 95);
        $explanations = [
            "This is a form input field for collecting user information.",
            "This button submits the form data to the server.",
            "This link navigates to another page in the application.",
            "This dropdown allows you to select from predefined options.",
            "This checkbox enables or disables a specific feature.",
        ];
        
        $suggestions = [
            "Click here to proceed",
            "Fill in your information",
            "Select the appropriate option",
            "Review before submitting",
        ];

        return [
            'explanation' => $explanations[array_rand($explanations)],
            'suggestions' => array_slice($suggestions, 0, rand(2, 4)),
            'confidence' => $confidence,
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
        // Mock AI chat response - replace with actual AI service integration
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
        // Mock voice processing - replace with actual speech-to-text service
        $mockTranscripts = [
            "Can you help me fill out this form?",
            "What information do I need to provide here?",
            "How do I complete this application?",
            "I need assistance with this page",
            "Can you explain what this field is for?",
        ];

        $transcript = $mockTranscripts[array_rand($mockTranscripts)];
        
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
    }

    public function translateContent(string $content, string $targetLanguage): string
    {
        // Mock translation - replace with actual translation service
        $translations = [
            'es' => 'Contenido traducido al español',
            'fr' => 'Contenu traduit en français',
            'de' => 'Ins Deutsche übersetzte Inhalte',
            'it' => 'Contenuto tradotto in italiano',
            'pt' => 'Conteúdo traduzido para português',
        ];

        return $translations[$targetLanguage] ?? "Translated: {$content}";
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
        // Mock document processing - replace with actual OCR/AI extraction
        $mockExtractedData = [
            'full_name' => 'John Doe',
            'email_address' => 'john.doe@example.com',
            'phone_number' => '+1-555-0123',
            'street_address' => '123 Main Street',
            'city_name' => 'New York',
            'postal_code' => '10001',
            'country_name' => 'United States',
            'date_of_birth' => '1990-01-15',
            'social_security' => '***-**-1234',
        ];

        // Simulate processing delay
        sleep(1);

        $document->update([
            'extracted_data' => $mockExtractedData,
            'processing_status' => 'completed',
        ]);
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
}
