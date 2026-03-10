<?php

namespace Database\Seeders;

use App\Models\ArtistCategory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ArtistCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Production & Management',
                'slug' => 'production-management',
                'children' => [
                    'Producer',
                    'Executive Producer',
                    'Co-Producer',
                    'Line Producer',
                    'Assistant Producer',
                    'Production Manager',
                    'Production Executive',
                    'Unit Manager',
                ],
            ],
            [
                'name' => 'Direction & Creative Leadership',
                'slug' => 'direction-creative-leadership',
                'children' => [
                    'Director',
                    'Assistant Director (1st / 2nd / 3rd AD)',
                    'Associate Director',
                    'Creative Director',
                    'Script Supervisor',
                ],
            ],
            [
                'name' => 'Writing & Story',
                'slug' => 'writing-story',
                'children' => [
                    'Story Writer',
                    'Screenwriter',
                    'Dialogue Writer',
                    'Script Editor',
                    'Lyricist',
                ],
            ],
            [
                'name' => 'Acting & Performance',
                'slug' => 'acting-performance',
                'children' => [
                    'Actor',
                    'Actress',
                    'Hero',
                    'Heroine',
                    'Character Artist',
                    'Supporting Actor / Actress',
                    'Child Artist',
                    'Theatre / Drama Actor',
                    'Voice Actor / Dubbing Artist',
                    'Junior Artist / Extra',
                ],
            ],
            [
                'name' => 'Cinematography & Camera',
                'slug' => 'cinematography-camera',
                'children' => [
                    'Director of Photography (DOP)',
                    'Camera Operator',
                    'Focus Puller',
                    'Camera Assistant',
                    'Drone Camera Operator',
                    'Steadicam Operator',
                ],
            ],
            [
                'name' => 'Lighting & Grip',
                'slug' => 'lighting-grip',
                'children' => [
                    'Chief Lighting Technician (Gaffer)',
                    'Light Man',
                    'Grip',
                    'Rigging Technician',
                ],
            ],
            [
                'name' => 'Sound & Music',
                'slug' => 'sound-music',
                'children' => [
                    'Music Director / Composer',
                    'Background Score Composer',
                    'Sound Designer',
                    'Sound Engineer',
                    'Foley Artist',
                    'Dubbing Engineer',
                    'Playback Singer',
                ],
            ],
            [
                'name' => 'Post-Production',
                'slug' => 'post-production',
                'children' => [
                    'Film Editor',
                    'Assistant Editor',
                    'Colourist',
                    'DI Technician',
                    'VFX Supervisor',
                    'VFX Artist',
                    'CGI Artist',
                    'Motion Graphics Designer',
                ],
            ],
            [
                'name' => 'Art, Costume & Makeup',
                'slug' => 'art-costume-makeup',
                'children' => [
                    'Art Director',
                    'Production Designer',
                    'Set Designer',
                    'Costume Designer',
                    'Stylist',
                    'Makeup Artist',
                    'Hair Stylist',
                    'Prosthetic Makeup Artist',
                ],
            ],
            [
                'name' => 'Dance & Action',
                'slug' => 'dance-action',
                'children' => [
                    'Choreographer',
                    'Assistant Choreographer',
                    'Dancer',
                    'Fight Master / Stunt Coordinator',
                    'Stunt Artist',
                ],
            ],
            [
                'name' => 'Publicity, Promotion & Media',
                'slug' => 'publicity-promotion-media',
                'children' => [
                    'Public Relations (PR) Manager',
                    'Marketing Head',
                    'Digital Marketing Executive',
                    'Poster Designer',
                    'Post Maker (Social Media Creative)',
                    'Trailer Editor',
                    'Social Media Manager',
                    'Content Strategist',
                ],
            ],
            [
                'name' => 'Digital & New-Age Media',
                'slug' => 'digital-new-age-media',
                'children' => [
                    'YouTube Content Creator',
                    'Short Film Maker',
                    'Reel Creator',
                    'Influencer',
                    'Podcast Creator',
                    'OTT Content Executive',
                ],
            ],
            [
                'name' => 'Television & Stage',
                'slug' => 'television-stage',
                'children' => [
                    'Anchor / Host',
                    'Reality Show Contestant',
                    'News Presenter',
                    'Stage Performer',
                    'Drama Director',
                    'Theatre Technician',
                ],
            ],
            [
                'name' => 'Legal, Finance & Distribution',
                'slug' => 'legal-finance-distribution',
                'children' => [
                    'Production Accountant',
                    'Legal Advisor',
                    'Film Distributor',
                    'Sales Agent',
                    'OTT Acquisition Manager',
                ],
            ],
            [
                'name' => 'Training & Support',
                'slug' => 'training-support',
                'children' => [
                    'Acting Coach',
                    'Dance Master',
                    'Voice Coach',
                    'Film School Faculty',
                    'Casting Director',
                ],
            ],
        ];

        foreach ($categories as $groupIndex => $group) {
            $parent = ArtistCategory::updateOrCreate(
                ['slug' => $group['slug']],
                [
                    'name' => $group['name'],
                    'parent_id' => null,
                    'sort_order' => $groupIndex + 1,
                ]
            );

            foreach ($group['children'] as $childIndex => $childName) {
                ArtistCategory::updateOrCreate(
                    ['slug' => Str::slug($childName)],
                    [
                        'name' => $childName,
                        'parent_id' => $parent->id,
                        'sort_order' => $childIndex + 1,
                    ]
                );
            }
        }
    }
}
