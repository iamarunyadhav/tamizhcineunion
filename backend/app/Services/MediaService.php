<?php

namespace App\Services;

use App\Models\MediaItem;
use App\Repositories\MediaRepository;
use Illuminate\Support\Str;

class MediaService
{
    public function __construct(private readonly MediaRepository $repository)
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

    public function create(array $data): MediaItem
    {
        $data['slug'] = $data['slug'] ?? Str::slug($data['title']);
        return $this->repository->create($data);
    }

    public function update(MediaItem $media, array $data): MediaItem
    {
        if (empty($data['slug']) && !empty($data['title'])) {
            $data['slug'] = Str::slug($data['title']);
        }

        return $this->repository->update($media, $data);
    }

    public function delete(MediaItem $media): void
    {
        $this->repository->delete($media);
    }
}
