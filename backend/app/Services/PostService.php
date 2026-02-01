<?php

namespace App\Services;

use App\Models\Post;
use App\Repositories\PostRepository;
use Illuminate\Support\Str;

class PostService
{
    public function __construct(private readonly PostRepository $repository)
    {
    }

    public function paginate(array $filters)
    {
        $perPage = $filters['per_page'] ?? 15;
        return $this->repository->paginate(
            $this->repository->list($filters),
            $perPage
        );
    }

    public function create(array $data): Post
    {
        $data['slug'] = $data['slug'] ?? Str::slug($data['title']);
        return $this->repository->create($data);
    }

    public function update(Post $post, array $data): Post
    {
        if (empty($data['slug']) && !empty($data['title'])) {
            $data['slug'] = Str::slug($data['title']);
        }

        return $this->repository->update($post, $data);
    }

    public function delete(Post $post): void
    {
        $this->repository->delete($post);
    }
}
