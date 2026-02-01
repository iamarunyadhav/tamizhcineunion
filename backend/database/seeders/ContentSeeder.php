<?php

namespace Database\Seeders;

use App\Models\Artist;
use App\Models\ArtistCategory;
use App\Models\ArtistMedia;
use App\Models\HeroSlide;
use App\Models\MediaCategory;
use App\Models\MediaItem;
use App\Models\Post;
use App\Models\Project;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ContentSeeder extends Seeder
{
    /**
     * Seed baseline content so the frontend has data to render.
     */
    public function run(): void
    {
        // Artist Categories
        $categoryIds = ArtistCategory::whereNull('parent_id')
            ->with('children')
            ->get()
            ->flatMap(function (ArtistCategory $cat) {
                $map = collect([$cat->slug => $cat->id]);
                foreach ($cat->children as $child) {
                    $map[$child->slug] = $child->id;
                }
                return $map;
            })
            ->toArray();

        // Artists
        $artists = [
          [
            'name' => 'Arun Das',
            'slug' => 'arun-das',
            'category_slug' => 'director',
            'location' => 'Kandy',
            'bio' => 'Independent director focusing on hill-country narratives.',
            'skills' => ['Directing', 'Screenwriting'],
            'featured' => true,
          ],
          [
            'name' => 'Meera Selvam',
            'slug' => 'meera-selvam',
            'category_slug' => 'actor',
            'location' => 'Nuwara Eliya',
            'bio' => 'Actor and theatre artist passionate about community stories.',
            'skills' => ['Acting', 'Voice'],
            'featured' => true,
          ],
        ];

        foreach ($artists as $artist) {
            $payload = $artist;
            $payload['category_id'] = $categoryIds[$artist['category_slug']] ?? null;
            unset($payload['category_slug'], $payload['slug']);

            $existing = Artist::where('slug', $artist['slug'])->first();
            if ($existing) {
                $existing->update($payload);
            } else {
                Artist::create(array_merge([
                    'id' => (string) Str::uuid(),
                    'slug' => $artist['slug'],
                ], $payload));
            }
        }

        // Artist galleries
        $arun = Artist::where('slug', 'arun-das')->first();
        if ($arun) {
            $galleryItems = [
                [
                    'type' => 'photo',
                    'title' => 'On set',
                    'url' => 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=1600&auto=format&fit=crop&q=80',
                    'position' => 0,
                    'focal_point' => ['x' => 0.5, 'y' => 0.35],
                ],
                [
                    'type' => 'photo',
                    'title' => 'Director profile',
                    'url' => 'https://images.unsplash.com/photo-1503389152951-9f343605f61e?w=1600&auto=format&fit=crop&q=80',
                    'position' => 1,
                    'focal_point' => ['x' => 0.48, 'y' => 0.32],
                ],
                [
                    'type' => 'video',
                    'title' => 'Showreel',
                    'url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                    'thumbnail' => 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&auto=format&fit=crop&q=80',
                    'position' => 2,
                    'is_cover_candidate' => false,
                ],
            ];

            foreach ($galleryItems as $item) {
                $existing = ArtistMedia::where('artist_id', $arun->id)
                    ->where('title', $item['title'])
                    ->first();

                if ($existing) {
                    $existing->update($item);
                } else {
                    ArtistMedia::create(array_merge([
                        'id' => (string) Str::uuid(),
                        'artist_id' => $arun->id,
                    ], $item));
                }
            }
        }

        // Projects
        $project = Project::where('slug', 'echoes-of-the-hills')->first();
        $projectPayload = [
            'title' => 'Echoes of the Hills',
            'type' => 'film',
            'status' => 'ongoing',
            'thumbnail' => null,
            'description' => 'A film capturing the stories of the hill-country Tamil community.',
            'featured' => true,
        ];
        if ($project) {
            $project->update($projectPayload);
        } else {
            $project = Project::create(array_merge([
                'id' => (string) Str::uuid(),
                'slug' => 'echoes-of-the-hills',
            ], $projectPayload));
        }

        // Media categories
        $mediaCategoriesSeed = [
            ['name' => 'Short Films', 'slug' => 'short-films', 'type' => 'video'],
            ['name' => 'Gallery', 'slug' => 'gallery', 'type' => 'photo'],
        ];

        $mediaCategoryIds = [];
        foreach ($mediaCategoriesSeed as $cat) {
            $existing = MediaCategory::where('slug', $cat['slug'])->first();
            if ($existing) {
                $existing->update([
                    'name' => $cat['name'],
                    'type' => $cat['type'],
                ]);
                $mediaCategoryIds[$cat['slug']] = $existing->id;
            } else {
                $created = MediaCategory::create(array_merge([
                    'id' => (string) Str::uuid(),
                ], $cat));
                $mediaCategoryIds[$cat['slug']] = $created->id;
            }
        }

        $videoCatId = $mediaCategoryIds['short-films'] ?? null;

        // Media items
        $mediaItemPayload = [
            'title' => 'Echoes Trailer',
            'type' => 'video',
            'category_id' => $videoCatId,
            'url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            'description' => 'First look trailer.',
            'featured' => true,
        ];
        $mediaItem = MediaItem::where('slug', 'echoes-trailer')->first();
        if ($mediaItem) {
            $mediaItem->update($mediaItemPayload);
        } else {
            MediaItem::create(array_merge([
                'id' => (string) Str::uuid(),
                'slug' => 'echoes-trailer',
            ], $mediaItemPayload));
        }

        // Posts
        $postPayload = [
            'title' => 'Welcome to TAMIZHCINEUNION',
            'excerpt' => 'Building a home for hill-country creatives.',
            'content' => 'We are excited to launch the platform for artists from the hills.',
            'category' => 'News',
            'tags' => ['community', 'launch'],
            'author' => 'Team TCU',
            'featured' => true,
            'published' => true,
            'published_at' => now(),
        ];
        $post = Post::where('slug', 'welcome-to-tamizhcineunion')->first();
        if ($post) {
            $post->update($postPayload);
        } else {
            Post::create(array_merge([
                'id' => (string) Str::uuid(),
                'slug' => 'welcome-to-tamizhcineunion',
            ], $postPayload));
        }

        // Hero slides (preserve classic sliders)
        $slides = [
            [
                'title' => 'Vision of the Screen',
                'subtitle' => 'A creative hub connecting filmmakers, musicians, and performing artists',
                'image' => 'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?w=1600&auto=format&fit=crop&q=80',
                'cta_text' => 'Meet Our Artists',
                'cta_link' => '/artists',
                'sort_order' => 1,
            ],
            [
                'title' => 'Stories That Matter',
                'subtitle' => 'Documenting the rich cultural heritage of our community through cinema',
                'image' => 'https://images.unsplash.com/photo-1505685296765-3a2736de412f?w=1600&auto=format&fit=crop&q=80',
                'cta_text' => 'View Projects',
                'cta_link' => '/projects',
                'sort_order' => 2,
            ],
            [
                'title' => 'Voice of the Hills',
                'subtitle' => 'Empowering hill country Tamil artists to share their stories with the world',
                'image' => 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?w=1600&auto=format&fit=crop&q=80',
                'cta_text' => 'Explore Our Vision',
                'cta_link' => '/who-we-are',
                'sort_order' => 3,
            ],
        ];

        foreach ($slides as $slide) {
            $existing = HeroSlide::where('title', $slide['title'])->first();
            $payload = array_merge($slide, ['active' => true]);
            if ($existing) {
                $existing->update($payload);
            } else {
                HeroSlide::create(array_merge([
                    'id' => (string) Str::uuid(),
                ], $payload));
            }
        }
    }
}
