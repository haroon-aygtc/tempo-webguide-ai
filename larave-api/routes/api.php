<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\AssistantController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\AnalyticsController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::get('/sanctum/csrf-cookie', function () {
    return response()->json(['message' => 'CSRF cookie set']);
});

// Authentication routes
Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
    
    // Protected auth routes
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/user', [AuthController::class, 'user']);
        Route::put('/user', [AuthController::class, 'updateProfile']);
        Route::put('/password', [AuthController::class, 'updatePassword']);
    });
});

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Assistant session management
    Route::post('/assistant/sessions', [AssistantController::class, 'startSession']);
    Route::get('/assistant/sessions/active', [AssistantController::class, 'getActiveSession']);
    Route::patch('/assistant/sessions/{session}/end', [AssistantController::class, 'endSession']);
    Route::post('/assistant/interactions', [AssistantController::class, 'recordInteraction']);
    Route::post('/assistant/analyze-element', [AssistantController::class, 'analyzeElement']);
    Route::post('/assistant/form-suggestions', [AssistantController::class, 'getFormSuggestions']);
    Route::post('/assistant/chat', [AssistantController::class, 'sendMessage']);
    Route::post('/assistant/voice', [AssistantController::class, 'processVoiceInput']);
    Route::post('/assistant/translate', [AssistantController::class, 'translateContent']);
    Route::post('/assistant/documents', [AssistantController::class, 'uploadDocument']);
    Route::post('/assistant/documents/{document}/suggestions', [AssistantController::class, 'getDocumentSuggestions']);
    
    // AI Provider and Model Management
    Route::prefix('ai')->group(function () {
        Route::get('/providers', [AssistantController::class, 'getProviders']);
        Route::post('/providers', [AssistantController::class, 'createProvider']);
        Route::patch('/providers/{provider}', [AssistantController::class, 'updateProvider']);
        Route::delete('/providers/{provider}', [AssistantController::class, 'deleteProvider']);
        Route::post('/providers/{provider}/test', [AssistantController::class, 'testProvider']);
        
        Route::get('/models', [AssistantController::class, 'getModels']);
        Route::patch('/models/{model}', [AssistantController::class, 'updateModel']);
        Route::post('/models/{model}/test', [AssistantController::class, 'testModel']);
    });
    
    // Assistant Configuration
    Route::prefix('assistant')->group(function () {
        Route::get('/configurations', [AssistantController::class, 'getConfigurations']);
        Route::post('/configurations', [AssistantController::class, 'createConfiguration']);
        Route::patch('/configurations/{config}', [AssistantController::class, 'updateConfiguration']);
        Route::delete('/configurations/{config}', [AssistantController::class, 'deleteConfiguration']);
        
        // Live Preview
        Route::prefix('preview')->group(function () {
            Route::post('/sessions', [AssistantController::class, 'createPreviewSession']);
            Route::post('/sessions/{session}/messages', [AssistantController::class, 'sendPreviewMessage']);
        });
    });

    // Settings management
    Route::prefix('settings')->group(function () {
        Route::get('/', [SettingsController::class, 'index']);
        Route::put('/', [SettingsController::class, 'update']);
        Route::post('/reset', [SettingsController::class, 'reset']);
        Route::get('/export', [SettingsController::class, 'export']);
        Route::post('/import', [SettingsController::class, 'import']);
    });
    
    // Analytics and reporting
    Route::prefix('analytics')->group(function () {
        Route::get('/dashboard', [AnalyticsController::class, 'dashboard']);
        Route::get('/sessions', [AnalyticsController::class, 'sessions']);
        Route::get('/interactions', [AnalyticsController::class, 'interactions']);
        Route::get('/performance', [AnalyticsController::class, 'performance']);
        Route::get('/export', [AnalyticsController::class, 'export']);
    });
});
