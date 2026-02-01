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
        Schema::table('artist_categories', function (Blueprint $table) {
            $table->uuid('parent_id')->nullable()->after('id');
            $table->foreign('parent_id')
                ->references('id')
                ->on('artist_categories')
                ->nullOnDelete();
            $table->index('parent_id');
        });

        Schema::create('artist_media', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('artist_id');
            $table->enum('type', ['photo', 'video'])->default('photo');
            $table->string('title')->nullable();
            $table->string('url');
            $table->string('thumbnail')->nullable();
            $table->json('focal_point')->nullable();
            $table->boolean('is_cover_candidate')->default(true);
            $table->integer('position')->default(0);
            $table->timestamps();

            $table->foreign('artist_id')
                ->references('id')
                ->on('artists')
                ->cascadeOnDelete();

            $table->index(['artist_id', 'position']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('artist_media');

        Schema::table('artist_categories', function (Blueprint $table) {
            $table->dropForeign(['parent_id']);
            $table->dropIndex(['parent_id']);
            $table->dropColumn('parent_id');
        });
    }
};
