<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('artist_categories', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('slug')->unique();
            $table->timestamps();
        });

        Schema::create('artists', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('photo')->nullable();
            $table->string('cover_image')->nullable();
            $table->uuid('category_id')->nullable();
            $table->string('location')->nullable();
            $table->text('bio')->nullable();
            $table->json('skills')->nullable();
            $table->string('social_facebook')->nullable();
            $table->string('social_instagram')->nullable();
            $table->string('social_youtube')->nullable();
            $table->boolean('featured')->default(false);
            $table->timestamps();

            $table->foreign('category_id')->references('id')->on('artist_categories')->nullOnDelete();
        });

        Schema::create('projects', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('title');
            $table->string('slug')->unique();
            $table->enum('type', ['film', 'theatre', 'music', 'visual', 'documentary'])->default('film');
            $table->enum('status', ['ongoing', 'completed', 'upcoming'])->default('upcoming');
            $table->string('thumbnail')->nullable();
            $table->string('banner_image')->nullable();
            $table->text('description')->nullable();
            $table->text('synopsis')->nullable();
            $table->date('release_date')->nullable();
            $table->boolean('featured')->default(false);
            $table->timestamps();
        });

        Schema::create('project_credits', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('project_id');
            $table->uuid('artist_id');
            $table->string('role');
            $table->timestamps();

            $table->foreign('project_id')->references('id')->on('projects')->cascadeOnDelete();
            $table->foreign('artist_id')->references('id')->on('artists')->cascadeOnDelete();
            $table->unique(['project_id', 'artist_id', 'role']);
        });

        Schema::create('media_categories', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('slug')->unique();
            $table->enum('type', ['video', 'photo', 'audio', 'document']);
            $table->timestamps();
        });

        Schema::create('media_items', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('title');
            $table->string('slug')->unique();
            $table->enum('type', ['video', 'photo', 'audio', 'document'])->default('video');
            $table->uuid('category_id')->nullable();
            $table->string('thumbnail')->nullable();
            $table->string('url');
            $table->text('description')->nullable();
            $table->string('duration')->nullable();
            $table->uuid('artist_id')->nullable();
            $table->uuid('project_id')->nullable();
            $table->boolean('featured')->default(false);
            $table->timestamps();

            $table->foreign('category_id')->references('id')->on('media_categories')->nullOnDelete();
            $table->foreign('artist_id')->references('id')->on('artists')->nullOnDelete();
            $table->foreign('project_id')->references('id')->on('projects')->nullOnDelete();
        });

        Schema::create('posts', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('excerpt')->nullable();
            $table->longText('content')->nullable();
            $table->string('cover_image')->nullable();
            $table->string('category')->nullable();
            $table->json('tags')->nullable();
            $table->string('author')->nullable();
            $table->boolean('featured')->default(false);
            $table->boolean('published')->default(false);
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
        });

        Schema::create('hero_slides', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('title');
            $table->text('subtitle')->nullable();
            $table->string('image');
            $table->string('video')->nullable();
            $table->string('cta_text')->nullable();
            $table->string('cta_link')->nullable();
            $table->integer('sort_order')->default(0);
            $table->boolean('active')->default(true);
            $table->timestamps();
        });

        Schema::create('site_settings', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('key')->unique();
            $table->json('value')->nullable();
            $table->timestamps();
        });

        Schema::create('membership_applications', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('phone');
            $table->string('email');
            $table->string('location')->nullable();
            $table->string('category')->nullable();
            $table->json('skills')->nullable();
            $table->text('bio')->nullable();
            $table->json('portfolio_links')->nullable();
            $table->string('profile_photo')->nullable();
            $table->string('status')->default('pending');
            $table->timestamps();
        });

        Schema::create('contact_messages', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('email');
            $table->string('phone')->nullable();
            $table->text('message');
            $table->boolean('read')->default(false);
            $table->timestamps();
        });

        Schema::create('user_roles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('role')->default('admin');
            $table->timestamps();
            $table->unique(['user_id', 'role']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_roles');
        Schema::dropIfExists('contact_messages');
        Schema::dropIfExists('membership_applications');
        Schema::dropIfExists('site_settings');
        Schema::dropIfExists('hero_slides');
        Schema::dropIfExists('posts');
        Schema::dropIfExists('media_items');
        Schema::dropIfExists('media_categories');
        Schema::dropIfExists('project_credits');
        Schema::dropIfExists('projects');
        Schema::dropIfExists('artists');
        Schema::dropIfExists('artist_categories');
    }
};
