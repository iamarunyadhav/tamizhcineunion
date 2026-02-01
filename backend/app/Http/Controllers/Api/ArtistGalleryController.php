<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Artist;
use App\Models\ArtistMedia;
use App\Services\ArtistMediaService;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ArtistGalleryController extends Controller
{
    public function __construct(private readonly ArtistMediaService $service)
    {
    }

    public function index(Artist $artist)
    {
        return response()->json(
            $this->service->allForArtist($artist)
        );
    }

    public function store(Request $request, Artist $artist)
    {
        $payload = $request->validate([
            'items' => ['sometimes', 'array', 'min:1'],
            'items.*.type' => ['required', Rule::in(['photo', 'video'])],
            'items.*.title' => ['nullable', 'string', 'max:255'],
            'items.*.url' => ['required', 'string', 'max:2048'],
            'items.*.thumbnail' => ['nullable', 'string', 'max:2048'],
            'items.*.focal_point' => ['nullable', 'array'],
            'items.*.focal_point.x' => ['numeric', 'between:0,1'],
            'items.*.focal_point.y' => ['numeric', 'between:0,1'],
            'items.*.is_cover_candidate' => ['boolean'],
            'items.*.position' => ['nullable', 'integer'],

            'type' => ['sometimes', Rule::in(['photo', 'video'])],
            'title' => ['sometimes', 'string', 'max:255'],
            'url' => ['sometimes', 'string', 'max:2048'],
            'thumbnail' => ['sometimes', 'string', 'max:2048'],
            'focal_point' => ['sometimes', 'array'],
            'focal_point.x' => ['numeric', 'between:0,1'],
            'focal_point.y' => ['numeric', 'between:0,1'],
            'is_cover_candidate' => ['boolean'],
            'position' => ['nullable', 'integer'],
        ]);

        $items = $payload['items'] ?? [array_intersect_key($payload, array_flip([
            'type',
            'title',
            'url',
            'thumbnail',
            'focal_point',
            'is_cover_candidate',
            'position',
        ]))];

        $created = $this->service->createMany($artist, $items);

        return response()->json($created, 201);
    }

    public function update(Request $request, Artist $artist, ArtistMedia $gallery)
    {
        abort_if($gallery->artist_id !== $artist->id, 404);

        $data = $request->validate([
            'type' => [Rule::in(['photo', 'video'])],
            'title' => ['nullable', 'string', 'max:255'],
            'url' => ['nullable', 'string', 'max:2048'],
            'thumbnail' => ['nullable', 'string', 'max:2048'],
            'focal_point' => ['nullable', 'array'],
            'focal_point.x' => ['numeric', 'between:0,1'],
            'focal_point.y' => ['numeric', 'between:0,1'],
            'is_cover_candidate' => ['boolean'],
            'position' => ['nullable', 'integer'],
        ]);

        $updated = $this->service->update($gallery, $data);

        return response()->json($updated);
    }

    public function destroy(Artist $artist, ArtistMedia $gallery)
    {
        abort_if($gallery->artist_id !== $artist->id, 404);

        $this->service->delete($gallery);

        return response()->json(status: 204);
    }
}
