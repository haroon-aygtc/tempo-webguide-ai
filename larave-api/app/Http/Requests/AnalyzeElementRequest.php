<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AnalyzeElementRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'element_selector' => 'required|string|max:1024',
            'element_text' => 'required|string|max:2048',
            'context' => 'nullable|string|max:4096',
        ];
    }

    public function messages(): array
    {
        return [
            'element_selector.required' => 'Element selector is required',
            'element_text.required' => 'Element text is required',
        ];
    }
}
