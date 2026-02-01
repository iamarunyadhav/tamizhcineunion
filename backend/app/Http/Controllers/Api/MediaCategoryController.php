<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MediaCategory;
use App\Services\MediaCategoryService;
use Illuminate\Http\Request;

class MediaCategoryController extends Controller
{
    public function __construct(private readonly MediaCategoryService $service)
    {
    }

    public function index()
    {
        return response()->json($this->service->all());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:media_categories,slug'],
            'type' => ['required', 'in:video,photo,audio,document'],
        ]);

        $category = $this->service->create($data);

        return response()->json($category, 201);
    }

    public function update(Request $request, MediaCategory $mediaCategory)
    {
        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:media_categories,slug,'.$mediaCategory->id.',id'],
            'type' => ['sometimes', 'in:video,photo,audio,document'],
        ]);

        $category = $this->service->update($mediaCategory, $data);

        return response()->json($category);
    }

    public function destroy(MediaCategory $mediaCategory)
    {
        $this->service->delete($mediaCategory);
        return response()->json(status: 204);
    }
}
