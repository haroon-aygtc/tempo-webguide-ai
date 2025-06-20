<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Interaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'session_id',
        'type',
        'element_selector',
        'element_text',
        'user_input',
        'assistant_response',
        'confidence_score',
    ];

    protected $casts = [
        'confidence_score' => 'float',
    ];

    public function session(): BelongsTo
    {
        return $this->belongsTo(AssistantSession::class, 'session_id');
    }
}
