<?php

namespace App\Services;

use App\Models\MediaCategory;
use App\Repositories\MediaCategoryRepository;
use Illuminate\Support\Str;

class MediaCategoryService
{
    public function __construct(private readonly MediaCategoryRepository $repository)
    {
    }

    public function all()
    {
        return $this->repository->query()->orderBy('name')->get();
    }

    public function create(array $data): MediaCategory
    {
        $data['slug'] = $data['slug'] ?? Str::slug($data['name']);
        return $this->repository->create($data);
    }

    public function update(MediaCategory $category, array $data): MediaCategory
    {
        if (empty($data['slug']) && !empty($data['name'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        return $this->repository->update($category, $data);
    }

    public function delete(MediaCategory $category): void
    {
        $this->repository->delete($category);
    }
}
