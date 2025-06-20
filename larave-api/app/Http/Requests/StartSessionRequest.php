<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StartSessionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'page_url' => 'required|string|url|max:2048',
            'page_title' => 'required|string|max:255',
            'language' => 'required|string|size:2',
            'metadata' => 'nullable|array',
            'metadata.user_agent' => 'nullable|string|max:512',
            'metadata.screen_resolution' => 'nullable|string|max:50',
            'metadata.timestamp' => 'nullable|date',
        ];
    }

    public function messages(): array
    {
        return [
            'page_url.required' => 'Page URL is required',
            'page_url.url' => 'Page URL must be a valid URL',
            'page_title.required' => 'Page title is required',
            'language.required' => 'Language is required',
            'language.size' => 'Language must be a 2-character code',
        ];
    }
}
