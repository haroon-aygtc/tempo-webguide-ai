<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateSettingsRequest;
use App\Services\SettingsService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class SettingsController extends Controller
{
    protected SettingsService $settingsService;

    public function __construct(SettingsService $settingsService)
    {
        $this->settingsService = $settingsService;
    }

    public function index(Request $request): JsonResponse
    {
        try {
            $settings = $this->settingsService->getAllSettings($request->user());

            return response()->json([
                'success' => true,
                'data' => $settings
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch settings'
            ], 500);
        }
    }

    public function update(UpdateSettingsRequest $request): JsonResponse
    {
        try {
            $settings = $this->settingsService->updateSettings(
                $request->user(),
                $request->validated()
            );

            Log::info('Settings updated', [
                'user_id' => $request->user()->id,
                'updated_keys' => array_keys($request->validated())
            ]);

            return response()->json([
                'success' => true,
                'data' => $settings,
                'message' => 'Settings updated successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to update settings', [
                'user_id' => $request->user()->id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to update settings'
            ], 500);
        }
    }

    public function reset(Request $request): JsonResponse
    {
        try {
            $settings = $this->settingsService->resetToDefaults($request->user());

            Log::info('Settings reset to defaults', [
                'user_id' => $request->user()->id
            ]);

            return response()->json([
                'success' => true,
                'data' => $settings,
                'message' => 'Settings reset to defaults successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to reset settings'
            ], 500);
        }
    }

    public function export(Request $request): JsonResponse
    {
        try {
            $exportData = $this->settingsService->exportSettings($request->user());

            return response()->json([
                'success' => true,
                'data' => $exportData,
                'message' => 'Settings exported successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to export settings'
            ], 500);
        }
    }

    public function import(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'settings' => 'required|array',
                'overwrite' => 'boolean'
            ]);

            $settings = $this->settingsService->importSettings(
                $request->user(),
                $request->input('settings'),
                $request->boolean('overwrite', false)
            );

            Log::info('Settings imported', [
                'user_id' => $request->user()->id,
                'overwrite' => $request->boolean('overwrite', false)
            ]);

            return response()->json([
                'success' => true,
                'data' => $settings,
                'message' => 'Settings imported successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to import settings'
            ], 500);
        }
    }
}
