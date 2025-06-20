<?php

namespace App\Http\Controllers;

use App\Http\Requests\StartSessionRequest;
use App\Http\Requests\RecordInteractionRequest;
use App\Http\Requests\AnalyzeElementRequest;
use App\Http\Requests\FormSuggestionsRequest;
use App\Http\Requests\ChatMessageRequest;
use App\Http\Requests\TranslateContentRequest;
use App\Services\AssistantService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class AssistantController extends Controller
{
    protected AssistantService $assistantService;

    public function __construct(AssistantService $assistantService)
    {
        $this->assistantService = $assistantService;
    }

    public function startSession(StartSessionRequest $request): JsonResponse
    {
        try {
            $session = $this->assistantService->startSession(
                $request->user(),
                $request->validated()
            );

            return response()->json([
                'success' => true,
                'data' => $session,
                'message' => 'Session started successfully'
            ], 201);
        } catch (\Exception $e) {
            Log::error('Failed to start assistant session', [
                'user_id' => $request->user()->id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to start session'
            ], 500);
        }
    }

    public function getActiveSession(Request $request): JsonResponse
    {
        try {
            $session = $this->assistantService->getActiveSession($request->user());

            return response()->json([
                'success' => true,
                'data' => $session
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch active session'
            ], 500);
        }
    }

    public function endSession(Request $request, $sessionId): JsonResponse
    {
        try {
            $this->assistantService->endSession($request->user(), $sessionId);

            return response()->json([
                'success' => true,
                'message' => 'Session ended successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to end session'
            ], 500);
        }
    }

    public function recordInteraction(RecordInteractionRequest $request): JsonResponse
    {
        try {
            $interaction = $this->assistantService->recordInteraction(
                $request->user(),
                $request->validated()
            );

            return response()->json([
                'success' => true,
                'data' => $interaction,
                'message' => 'Interaction recorded successfully'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to record interaction'
            ], 500);
        }
    }

    public function analyzeElement(AnalyzeElementRequest $request): JsonResponse
    {
        try {
            $analysis = $this->assistantService->analyzeElement(
                $request->validated()
            );

            return response()->json([
                'success' => true,
                'data' => $analysis
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to analyze element'
            ], 500);
        }
    }

    public function getFormSuggestions(FormSuggestionsRequest $request): JsonResponse
    {
        try {
            $suggestions = $this->assistantService->getFormSuggestions(
                $request->user(),
                $request->validated('form_data')
            );

            return response()->json([
                'success' => true,
                'data' => $suggestions
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get form suggestions'
            ], 500);
        }
    }

    public function sendMessage(ChatMessageRequest $request): JsonResponse
    {
        try {
            $response = $this->assistantService->sendMessage(
                $request->user(),
                $request->validated()
            );

            return response()->json([
                'success' => true,
                'data' => ['response' => $response]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to process message'
            ], 500);
        }
    }

    public function processVoiceInput(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'audio' => 'required|file|mimes:wav,mp3,m4a|max:10240', // 10MB max
                'session_id' => 'required|integer|exists:assistant_sessions,id',
                'language' => 'required|string|max:10'
            ]);

            $result = $this->assistantService->processVoiceInput(
                $request->user(),
                $request->file('audio'),
                $request->input('session_id'),
                $request->input('language')
            );

            return response()->json([
                'success' => true,
                'data' => $result
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to process voice input'
            ], 500);
        }
    }

    public function translateContent(TranslateContentRequest $request): JsonResponse
    {
        try {
            $translation = $this->assistantService->translateContent(
                $request->validated('content'),
                $request->validated('target_language')
            );

            return response()->json([
                'success' => true,
                'data' => ['translation' => $translation]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to translate content'
            ], 500);
        }
    }

    public function uploadDocument(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'document' => 'required|file|mimes:pdf,doc,docx,txt|max:5120' // 5MB max
            ]);

            $document = $this->assistantService->uploadDocument(
                $request->user(),
                $request->file('document')
            );

            return response()->json([
                'success' => true,
                'data' => $document,
                'message' => 'Document uploaded successfully'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to upload document'
            ], 500);
        }
    }

    public function getDocumentSuggestions(Request $request, $documentId): JsonResponse
    {
        try {
            $request->validate([
                'form_fields' => 'required|array',
                'form_fields.*' => 'string'
            ]);

            $suggestions = $this->assistantService->getDocumentSuggestions(
                $request->user(),
                $documentId,
                $request->input('form_fields')
            );

            return response()->json([
                'success' => true,
                'data' => $suggestions
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get document suggestions'
            ], 500);
        }
    }
}
