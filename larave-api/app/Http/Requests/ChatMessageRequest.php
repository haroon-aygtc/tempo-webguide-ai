<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ChatMessageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'session_id' => 'required|integer|exists:assistant_sessions,id',
            'message' => 'required|string|max:4096',
            'language' => 'required|string|size:2',
        ];
    }

    public function messages(): array
    {
        return [
            'session_id.required' => 'Session ID is required',
            'session_id.exists' => 'Invalid session ID',
            'message.required' => 'Message is required',
            'language.required' => 'Language is required',
            'language.size' => 'Language must be a 2-character code',
        ];
    }
}
