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
    Route::prefix('assistant')->group(function () {
        Route::post('/sessions', [AssistantController::class, 'startSession']);
        Route::get('/sessions/active', [AssistantController::class, 'getActiveSession']);
        Route::patch('/sessions/{session}/end', [AssistantController::class, 'endSession']);
        Route::post('/interactions', [AssistantController::class, 'recordInteraction']);
        Route::post('/analyze-element', [AssistantController::class, 'analyzeElement']);
        Route::post('/form-suggestions', [AssistantController::class, 'getFormSuggestions']);
        Route::post('/chat', [AssistantController::class, 'sendMessage']);
        Route::post('/voice', [AssistantController::class, 'processVoiceInput']);
        Route::post('/translate', [AssistantController::class, 'translateContent']);
        Route::post('/documents', [AssistantController::class, 'uploadDocument']);
        Route::post('/documents/{document}/suggestions', [AssistantController::class, 'getDocumentSuggestions']);
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
