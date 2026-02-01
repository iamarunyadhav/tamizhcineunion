<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('member_profiles', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->uuid('membership_application_id')->nullable();
            $table->string('phone')->nullable();
            $table->string('location')->nullable();
            $table->string('category')->nullable();
            $table->json('skills')->nullable();
            $table->text('bio')->nullable();
            $table->json('portfolio_links')->nullable();
            $table->string('profile_photo')->nullable();
            $table->timestamps();

            $table->foreign('membership_application_id')
                ->references('id')
                ->on('membership_applications')
                ->nullOnDelete();
            $table->unique('user_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('member_profiles');
    }
};
