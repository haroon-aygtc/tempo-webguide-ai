<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'resend' => [
        'key' => env('RESEND_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    // AI Service Providers
    'openai' => [
        'api_key' => env('OPENAI_API_KEY'),
        'organization' => env('OPENAI_ORGANIZATION'),
        'base_url' => env('OPENAI_BASE_URL', 'https://api.openai.com/v1'),
    ],

    'anthropic' => [
        'api_key' => env('ANTHROPIC_API_KEY'),
        'base_url' => env('ANTHROPIC_BASE_URL', 'https://api.anthropic.com'),
    ],

    'google' => [
        'gemini_api_key' => env('GOOGLE_GEMINI_API_KEY'),
        'translate_api_key' => env('GOOGLE_TRANSLATE_API_KEY'),
        'cloud_vision_key' => env('GOOGLE_CLOUD_VISION_KEY'),
    ],

    'azure' => [
        'cognitive_services_key' => env('AZURE_COGNITIVE_SERVICES_KEY'),
        'cognitive_services_endpoint' => env('AZURE_COGNITIVE_SERVICES_ENDPOINT'),
        'speech_key' => env('AZURE_SPEECH_KEY'),
        'speech_region' => env('AZURE_SPEECH_REGION'),
    ],

];
