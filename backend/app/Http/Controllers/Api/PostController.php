<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Services\PostService;
use Illuminate\Http\Request;

class PostController extends Controller
{
    public function __construct(private readonly PostService $service)
    {
    }

    public function index(Request $request)
    {
        $filters = $request->all();
        $filters['published'] ??= true;
        $posts = $this->service->paginate($filters);
        return response()->json($posts);
    }

    public function show(Post $post)
    {
        return response()->json($post);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:posts,slug'],
            'excerpt' => ['nullable', 'string'],
            'content' => ['nullable', 'string'],
            'cover_image' => ['nullable', 'string', 'max:2048'],
            'category' => ['nullable', 'string', 'max:255'],
            'tags' => ['nullable', 'array'],
            'author' => ['nullable', 'string', 'max:255'],
            'featured' => ['boolean'],
            'published' => ['boolean'],
            'published_at' => ['nullable', 'date'],
        ]);

        $post = $this->service->create($data);

        return response()->json($post, 201);
    }

    public function update(Request $request, Post $post)
    {
        $data = $request->validate([
            'title' => ['sometimes', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:posts,slug,'.$post->id.',id'],
            'excerpt' => ['nullable', 'string'],
            'content' => ['nullable', 'string'],
            'cover_image' => ['nullable', 'string', 'max:2048'],
            'category' => ['nullable', 'string', 'max:255'],
            'tags' => ['nullable', 'array'],
            'author' => ['nullable', 'string', 'max:255'],
            'featured' => ['boolean'],
            'published' => ['boolean'],
            'published_at' => ['nullable', 'date'],
        ]);

        $post = $this->service->update($post, $data);

        return response()->json($post);
    }

    public function destroy(Post $post)
    {
        $this->service->delete($post);
        return response()->json(status: 204);
    }
}
