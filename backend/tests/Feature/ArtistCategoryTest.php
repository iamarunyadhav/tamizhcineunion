<?php

namespace Tests\Feature;

use App\Models\Artist;
use App\Models\ArtistCategory;
use Database\Seeders\ArtistCategorySeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ArtistCategoryTest extends TestCase
{
    use RefreshDatabase;

    public function test_artist_categories_endpoint_returns_seeded_hierarchy_in_curated_order(): void
    {
        $this->seed(ArtistCategorySeeder::class);

        $response = $this->getJson('/api/artist-categories');

        $response->assertOk();
        $categories = $response->json();

        $this->assertSame('Production & Management', $categories[0]['name']);
        $this->assertSame('Direction & Creative Leadership', $categories[1]['name']);
        $this->assertSame('Producer', $categories[0]['children'][0]['name']);
        $this->assertSame('Executive Producer', $categories[0]['children'][1]['name']);
    }

    public function test_artists_can_be_filtered_by_top_level_category_slug(): void
    {
        $this->seed(ArtistCategorySeeder::class);

        $actingCategory = ArtistCategory::where('slug', 'actor')->firstOrFail();
        $directorCategory = ArtistCategory::where('slug', 'director')->firstOrFail();

        Artist::create([
            'name' => 'Main Category Match',
            'slug' => 'main-category-match',
            'category_id' => $actingCategory->id,
        ]);

        Artist::create([
            'name' => 'Other Category Match',
            'slug' => 'other-category-match',
            'category_id' => $directorCategory->id,
        ]);

        $response = $this->getJson('/api/artists?category=acting-performance');

        $response->assertOk();
        $response->assertJsonCount(1, 'data');
        $response->assertJsonPath('data.0.slug', 'main-category-match');
    }
}
