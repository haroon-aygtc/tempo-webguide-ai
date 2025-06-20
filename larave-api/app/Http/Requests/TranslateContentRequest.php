<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TranslateContentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'content' => 'required|string|max:8192',
            'target_language' => 'required|string|size:2',
        ];
    }

    public function messages(): array
    {
        return [
            'content.required' => 'Content to translate is required',
            'target_language.required' => 'Target language is required',
            'target_language.size' => 'Target language must be a 2-character code',
        ];
    }
}
