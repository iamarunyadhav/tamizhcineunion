<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ArtistCategory;
use App\Services\ArtistCategoryService;
use Illuminate\Http\Request;

class ArtistCategoryController extends Controller
{
    public function __construct(private readonly ArtistCategoryService $service)
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
            'slug' => ['nullable', 'string', 'max:255', 'unique:artist_categories,slug'],
            'parent_id' => ['nullable', 'exists:artist_categories,id'],
        ]);

        $category = $this->service->create($data);

        return response()->json($category, 201);
    }

    public function update(Request $request, ArtistCategory $artistCategory)
    {
        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:artist_categories,slug,'.$artistCategory->id.',id'],
            'parent_id' => ['nullable', 'exists:artist_categories,id'],
        ]);

        $category = $this->service->update($artistCategory, $data);

        return response()->json($category);
    }

    public function destroy(ArtistCategory $artistCategory)
    {
        $this->service->delete($artistCategory);
        return response()->json(status: 204);
    }
}
