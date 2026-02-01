<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MediaItem;
use App\Services\MediaService;
use Illuminate\Http\Request;

class MediaController extends Controller
{
    public function __construct(private readonly MediaService $service)
    {
    }

    public function index(Request $request)
    {
        $media = $this->service->paginate($request->all());
        return response()->json($media);
    }

    public function show(MediaItem $medium)
    {
        return response()->json($medium->load('category', 'artist', 'project'));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:media_items,slug'],
            'type' => ['required', 'in:video,photo,audio,document'],
            'category_id' => ['nullable', 'exists:media_categories,id'],
            'thumbnail' => ['nullable', 'string', 'max:2048'],
            'url' => ['required', 'string', 'max:2048'],
            'description' => ['nullable', 'string'],
            'duration' => ['nullable', 'string', 'max:255'],
            'artist_id' => ['nullable', 'exists:artists,id'],
            'project_id' => ['nullable', 'exists:projects,id'],
            'featured' => ['boolean'],
        ]);

        $media = $this->service->create($data);

        return response()->json($media, 201);
    }

    public function update(Request $request, MediaItem $medium)
    {
        $data = $request->validate([
            'title' => ['sometimes', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:media_items,slug,'.$medium->id.',id'],
            'type' => ['sometimes', 'in:video,photo,audio,document'],
            'category_id' => ['nullable', 'exists:media_categories,id'],
            'thumbnail' => ['nullable', 'string', 'max:2048'],
            'url' => ['sometimes', 'string', 'max:2048'],
            'description' => ['nullable', 'string'],
            'duration' => ['nullable', 'string', 'max:255'],
            'artist_id' => ['nullable', 'exists:artists,id'],
            'project_id' => ['nullable', 'exists:projects,id'],
            'featured' => ['boolean'],
        ]);

        $media = $this->service->update($medium, $data);

        return response()->json($media);
    }

    public function destroy(MediaItem $medium)
    {
        $this->service->delete($medium);
        return response()->json(status: 204);
    }
}
