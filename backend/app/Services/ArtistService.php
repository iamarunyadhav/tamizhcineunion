<?php

namespace App\Services;

use App\Models\Artist;
use App\Repositories\ArtistRepository;
use Illuminate\Support\Str;

class ArtistService
{
    public function __construct(private readonly ArtistRepository $repository)
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

    public function create(array $data): Artist
    {
        $data['slug'] = $data['slug'] ?? Str::slug($data['name']);
        return $this->repository->create($data);
    }

    public function update(Artist $artist, array $data): Artist
    {
        if (empty($data['slug']) && !empty($data['name'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        return $this->repository->update($artist, $data);
    }

    public function delete(Artist $artist): void
    {
        $this->repository->delete($artist);
    }
}
