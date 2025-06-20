<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RecordInteractionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'session_id' => 'required|integer|exists:assistant_sessions,id',
            'type' => 'required|string|in:highlight,form_assist,voice,chat',
            'element_selector' => 'nullable|string|max:1024',
            'element_text' => 'nullable|string|max:2048',
            'user_input' => 'nullable|string|max:4096',
            'assistant_response' => 'nullable|string|max:4096',
            'confidence_score' => 'nullable|numeric|min:0|max:100',
        ];
    }

    public function messages(): array
    {
        return [
            'session_id.required' => 'Session ID is required',
            'session_id.exists' => 'Invalid session ID',
            'type.required' => 'Interaction type is required',
            'type.in' => 'Invalid interaction type',
            'confidence_score.numeric' => 'Confidence score must be a number',
            'confidence_score.min' => 'Confidence score must be at least 0',
            'confidence_score.max' => 'Confidence score must not exceed 100',
        ];
    }
}
