<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('interactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('session_id')->constrained('assistant_sessions')->onDelete('cascade');
            $table->enum('type', ['highlight', 'form_assist', 'voice', 'chat']);
            $table->string('element_selector', 1024)->nullable();
            $table->text('element_text')->nullable();
            $table->text('user_input')->nullable();
            $table->text('assistant_response')->nullable();
            $table->decimal('confidence_score', 5, 2)->nullable();
            $table->timestamps();
            
            $table->index(['session_id', 'type']);
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('interactions');
    }
};
