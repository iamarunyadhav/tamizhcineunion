<?php

namespace App\Services;

use App\Models\Artist;
use App\Models\ArtistMedia;
use App\Repositories\ArtistMediaRepository;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

class ArtistMediaService
{
    public function __construct(private readonly ArtistMediaRepository $repository)
    {
    }

    public function allForArtist(Artist $artist): Collection
    {
        return $this->repository->listForArtist($artist->id)->get();
    }

    public function createMany(Artist $artist, array $items): Collection
    {
        return collect($items)->map(function (array $item, int $index) use ($artist) {
            return $this->create($artist, $item, $index);
        });
    }

    public function create(Artist $artist, array $data, int $positionOffset = 0): ArtistMedia
    {
        $data['artist_id'] = $artist->id;
        $data['position'] = $data['position'] ?? ($this->nextPosition($artist) + $positionOffset);

        return $this->repository->create($data);
    }

    public function update(ArtistMedia $item, array $data): ArtistMedia
    {
        if (!empty($data['position'])) {
            $data['position'] = (int) $data['position'];
        }

        return $this->repository->update($item, $data);
    }

    public function delete(ArtistMedia $item): void
    {
        $this->repository->delete($item);
    }

    protected function nextPosition(Artist $artist): int
    {
        $last = $this->repository
            ->listForArtist($artist->id)
            ->orderByDesc('position')
            ->first();

        return $last?->position + 1 ?? 0;
    }
}
