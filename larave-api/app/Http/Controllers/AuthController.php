<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\UpdateProfileRequest;
use App\Http\Requests\UpdatePasswordRequest;
use App\Services\AuthService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    protected AuthService $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    public function login(LoginRequest $request): JsonResponse
    {
        try {
            $user = $this->authService->login(
                $request->validated('email'),
                $request->validated('password')
            );

            return response()->json([
                'success' => true,
                'data' => [
                    'user' => $user,
                    'token' => $user->createToken('auth-token')->plainTextToken,
                    'expires_at' => now()->addDays(30)->toISOString()
                ],
                'message' => 'Login successful'
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid credentials',
                'errors' => $e->errors()
            ], 401);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Login failed. Please try again.'
            ], 500);
        }
    }

    public function register(RegisterRequest $request): JsonResponse
    {
        try {
            $user = $this->authService->register(
                $request->validated('name'),
                $request->validated('email'),
                $request->validated('password')
            );

            return response()->json([
                'success' => true,
                'data' => [
                    'user' => $user,
                    'token' => $user->createToken('auth-token')->plainTextToken,
                    'expires_at' => now()->addDays(30)->toISOString()
                ],
                'message' => 'Registration successful'
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Registration failed. Please try again.'
            ], 500);
        }
    }

    public function logout(Request $request): JsonResponse
    {
        try {
            // Revoke all tokens for the user
            $request->user()->tokens()->delete();
            
            // Also handle session-based logout
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return response()->json([
                'success' => true,
                'message' => 'Logout successful'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Logout failed'
            ], 500);
        }
    }

    public function user(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            $user->load(['sessions' => function ($query) {
                $query->where('status', 'active')->latest()->limit(5);
            }]);

            return response()->json([
                'success' => true,
                'data' => $user
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch user data'
            ], 500);
        }
    }

    public function updateProfile(UpdateProfileRequest $request): JsonResponse
    {
        try {
            $user = $request->user();
            $user->update($request->validated());

            return response()->json([
                'success' => true,
                'data' => $user->fresh(),
                'message' => 'Profile updated successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update profile'
            ], 500);
        }
    }

    public function updatePassword(UpdatePasswordRequest $request): JsonResponse
    {
        try {
            $user = $request->user();
            
            // Verify current password
            if (!Hash::check($request->validated('current_password'), $user->password)) {
                throw ValidationException::withMessages([
                    'current_password' => ['The current password is incorrect.']
                ]);
            }

            // Update password
            $user->update([
                'password' => Hash::make($request->validated('new_password'))
            ]);

            // Revoke all existing tokens to force re-login
            $user->tokens()->delete();

            return response()->json([
                'success' => true,
                'message' => 'Password updated successfully. Please log in again.'
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update password'
            ], 500);
        }
    }
}
