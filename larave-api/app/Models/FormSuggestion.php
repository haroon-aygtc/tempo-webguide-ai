<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FormSuggestion extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'session_id',
        'field_name',
        'suggested_value',
        'confidence_score',
        'source_type',
        'source_id',
        'applied',
    ];

    protected $casts = [
        'confidence_score' => 'float',
        'applied' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function session(): BelongsTo
    {
        return $this->belongsTo(AssistantSession::class, 'session_id');
    }
}
