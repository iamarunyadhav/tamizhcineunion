<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Artist;
use App\Services\ArtistService;
use Illuminate\Http\Request;

class ArtistController extends Controller
{
    public function __construct(private readonly ArtistService $service)
    {
    }

    public function index(Request $request)
    {
        $artists = $this->service->paginate($request->all());
        return response()->json($artists);
    }

    public function show(Artist $artist)
    {
        return response()->json(
            $artist->load('category.parent', 'projectCredits', 'mediaItems', 'gallery')
        );
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:artists,slug'],
            'date_of_birth' => ['nullable', 'date'],
            'photo' => ['nullable', 'string', 'max:2048'],
            'cover_image' => ['nullable', 'string', 'max:2048'],
            'category_id' => ['nullable', 'exists:artist_categories,id'],
            'location' => ['nullable', 'string', 'max:255'],
            'bio' => ['nullable', 'string'],
            'skills' => ['nullable', 'array'],
            'social_facebook' => ['nullable', 'string', 'max:255'],
            'social_instagram' => ['nullable', 'string', 'max:255'],
            'social_youtube' => ['nullable', 'string', 'max:255'],
            'featured' => ['boolean'],
        ]);

        $artist = $this->service->create($data);

        return response()->json($artist, 201);
    }

    public function update(Request $request, Artist $artist)
    {
        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:artists,slug,'.$artist->id.',id'],
            'date_of_birth' => ['nullable', 'date'],
            'photo' => ['nullable', 'string', 'max:2048'],
            'cover_image' => ['nullable', 'string', 'max:2048'],
            'category_id' => ['nullable', 'exists:artist_categories,id'],
            'location' => ['nullable', 'string', 'max:255'],
            'bio' => ['nullable', 'string'],
            'skills' => ['nullable', 'array'],
            'social_facebook' => ['nullable', 'string', 'max:255'],
            'social_instagram' => ['nullable', 'string', 'max:255'],
            'social_youtube' => ['nullable', 'string', 'max:255'],
            'featured' => ['boolean'],
        ]);

        $artist = $this->service->update($artist, $data);

        return response()->json($artist);
    }

    public function destroy(Artist $artist)
    {
        $this->service->delete($artist);
        return response()->json(status: 204);
    }
}
