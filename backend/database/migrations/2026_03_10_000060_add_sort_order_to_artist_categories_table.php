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
            $table->unsignedInteger('sort_order')->default(0)->after('slug');
            $table->index(['parent_id', 'sort_order'], 'artist_categories_parent_sort_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('artist_categories', function (Blueprint $table) {
            $table->dropIndex('artist_categories_parent_sort_index');
            $table->dropColumn('sort_order');
        });
    }
};
