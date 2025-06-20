<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class FormSuggestionsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'form_data' => 'required|array',
            'form_data.*' => 'nullable|string|max:1024',
        ];
    }

    public function messages(): array
    {
        return [
            'form_data.required' => 'Form data is required',
            'form_data.array' => 'Form data must be an array',
        ];
    }
}
