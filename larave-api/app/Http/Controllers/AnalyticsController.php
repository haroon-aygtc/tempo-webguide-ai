<?php

namespace App\Http\Controllers;

use App\Services\AnalyticsService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Carbon\Carbon;

class AnalyticsController extends Controller
{
    protected AnalyticsService $analyticsService;

    public function __construct(AnalyticsService $analyticsService)
    {
        $this->analyticsService = $analyticsService;
    }

    public function dashboard(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'period' => 'string|in:today,week,month,quarter,year',
                'start_date' => 'date',
                'end_date' => 'date|after_or_equal:start_date'
            ]);

            $period = $request->input('period', 'month');
            $startDate = $request->input('start_date');
            $endDate = $request->input('end_date');

            // Set default date range based on period
            if (!$startDate || !$endDate) {
                [$startDate, $endDate] = $this->getDateRange($period);
            }

            $analytics = $this->analyticsService->getDashboardAnalytics(
                $request->user(),
                Carbon::parse($startDate),
                Carbon::parse($endDate)
            );

            return response()->json([
                'success' => true,
                'data' => $analytics
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch dashboard analytics'
            ], 500);
        }
    }

    public function sessions(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'page' => 'integer|min:1',
                'per_page' => 'integer|min:1|max:100',
                'status' => 'string|in:active,completed,abandoned',
                'start_date' => 'date',
                'end_date' => 'date|after_or_equal:start_date'
            ]);

            $sessions = $this->analyticsService->getSessionAnalytics(
                $request->user(),
                $request->only(['page', 'per_page', 'status', 'start_date', 'end_date'])
            );

            return response()->json([
                'success' => true,
                'data' => $sessions
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch session analytics'
            ], 500);
        }
    }

    public function interactions(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'page' => 'integer|min:1',
                'per_page' => 'integer|min:1|max:100',
                'type' => 'string|in:highlight,form_assist,voice,chat',
                'session_id' => 'integer|exists:assistant_sessions,id',
                'start_date' => 'date',
                'end_date' => 'date|after_or_equal:start_date'
            ]);

            $interactions = $this->analyticsService->getInteractionAnalytics(
                $request->user(),
                $request->only(['page', 'per_page', 'type', 'session_id', 'start_date', 'end_date'])
            );

            return response()->json([
                'success' => true,
                'data' => $interactions
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch interaction analytics'
            ], 500);
        }
    }

    public function performance(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'period' => 'string|in:today,week,month,quarter,year',
                'metric' => 'string|in:response_time,success_rate,user_satisfaction,completion_rate'
            ]);

            $period = $request->input('period', 'month');
            $metric = $request->input('metric');
            [$startDate, $endDate] = $this->getDateRange($period);

            $performance = $this->analyticsService->getPerformanceMetrics(
                $request->user(),
                Carbon::parse($startDate),
                Carbon::parse($endDate),
                $metric
            );

            return response()->json([
                'success' => true,
                'data' => $performance
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch performance metrics'
            ], 500);
        }
    }

    public function export(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'type' => 'required|string|in:sessions,interactions,analytics',
                'format' => 'string|in:json,csv,xlsx',
                'start_date' => 'date',
                'end_date' => 'date|after_or_equal:start_date'
            ]);

            $exportData = $this->analyticsService->exportData(
                $request->user(),
                $request->input('type'),
                $request->input('format', 'json'),
                $request->only(['start_date', 'end_date'])
            );

            return response()->json([
                'success' => true,
                'data' => $exportData,
                'message' => 'Data exported successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to export data'
            ], 500);
        }
    }

    private function getDateRange(string $period): array
    {
        $endDate = Carbon::now();
        
        switch ($period) {
            case 'today':
                $startDate = Carbon::today();
                break;
            case 'week':
                $startDate = Carbon::now()->subWeek();
                break;
            case 'month':
                $startDate = Carbon::now()->subMonth();
                break;
            case 'quarter':
                $startDate = Carbon::now()->subQuarter();
                break;
            case 'year':
                $startDate = Carbon::now()->subYear();
                break;
            default:
                $startDate = Carbon::now()->subMonth();
        }

        return [$startDate->toDateString(), $endDate->toDateString()];
    }
}
