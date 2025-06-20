<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('form_suggestions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('session_id')->nullable()->constrained('assistant_sessions')->onDelete('cascade');
            $table->string('field_name');
            $table->text('suggested_value');
            $table->decimal('confidence_score', 5, 2);
            $table->enum('source_type', ['document', 'profile', 'history']);
            $table->unsignedBigInteger('source_id')->nullable();
            $table->boolean('applied')->default(false);
            $table->timestamps();
            
            $table->index(['user_id', 'session_id']);
            $table->index(['source_type', 'source_id']);
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('form_suggestions');
    }
};
