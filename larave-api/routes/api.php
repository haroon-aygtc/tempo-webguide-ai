<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

// Authentication routes
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/register', [AuthController::class, 'register']);
Route::get('/sanctum/csrf-cookie', [AuthController::class, 'getCsrfToken']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/user', [AuthController::class, 'user']);
});
