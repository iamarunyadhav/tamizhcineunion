<?php

namespace App\Repositories;

use App\Models\MediaItem;
use Illuminate\Database\Eloquent\Builder;

class MediaRepository extends BaseRepository
{
    public function __construct(MediaItem $model)
    {
        parent::__construct($model);
    }

    public function list(array $filters = []): Builder
    {
        $query = $this->query()->with(['category', 'artist', 'project']);

        if (!empty($filters['type'])) {
            $query->where('type', $filters['type']);
        }

        if (!empty($filters['category'])) {
            $query->whereHas('category', function (Builder $q) use ($filters) {
                $q->where('slug', $filters['category'])->orWhere('id', $filters['category']);
            });
        }

        if (!empty($filters['search'])) {
            $query->where('title', 'like', '%'.$filters['search'].'%');
        }

        if (!empty($filters['artist'])) {
            $query->whereHas('artist', function (Builder $q) use ($filters) {
                $q->where('slug', $filters['artist'])->orWhere('id', $filters['artist']);
            });
        }

        if (!empty($filters['featured'])) {
            $query->where('featured', true);
        }

        return $query->orderByDesc('created_at');
    }
}
