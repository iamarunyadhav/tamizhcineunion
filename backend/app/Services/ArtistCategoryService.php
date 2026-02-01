<?php

namespace App\Services;

use App\Models\ArtistCategory;
use App\Repositories\ArtistCategoryRepository;
use Illuminate\Support\Str;

class ArtistCategoryService
{
    public function __construct(private readonly ArtistCategoryRepository $repository)
    {
    }

    public function all()
    {
        return $this->repository->query()
            ->with('children')
            ->whereNull('parent_id')
            ->orderBy('name')
            ->get();
    }

    public function create(array $data): ArtistCategory
    {
        $data['slug'] = $data['slug'] ?? Str::slug($data['name']);
        return $this->repository->create($data);
    }

    public function update(ArtistCategory $category, array $data): ArtistCategory
    {
        if (empty($data['slug']) && !empty($data['name'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        return $this->repository->update($category, $data);
    }

    public function delete(ArtistCategory $category): void
    {
        $this->repository->delete($category);
    }
}
