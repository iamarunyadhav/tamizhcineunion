<?php

namespace App\Repositories;

use App\Models\Artist;
use Illuminate\Database\Eloquent\Builder;

class ArtistRepository extends BaseRepository
{
    public function __construct(Artist $model)
    {
        parent::__construct($model);
    }

    public function list(array $filters = []): Builder
    {
        $query = $this->query()->with(['category.parent']);

        if (!empty($filters['search'])) {
            $query->where(function (Builder $artistQuery) use ($filters) {
                $artistQuery
                    ->where('name', 'like', '%'.$filters['search'].'%')
                    ->orWhere('bio', 'like', '%'.$filters['search'].'%');
            });
        }

        if (!empty($filters['category'])) {
            $query->where(function (Builder $artistQuery) use ($filters) {
                $artistQuery
                    ->whereHas('category', function (Builder $q) use ($filters) {
                        $q->where('slug', $filters['category'])
                            ->orWhere('id', $filters['category']);
                    })
                    ->orWhereHas('category.parent', function (Builder $q) use ($filters) {
                        $q->where('slug', $filters['category'])
                            ->orWhere('id', $filters['category']);
                    });
            });
        }

        if (!empty($filters['main_category'])) {
            $query->whereHas('category.parent', function (Builder $q) use ($filters) {
                $q->where('slug', $filters['main_category'])->orWhere('id', $filters['main_category']);
            });
        }

        if (array_key_exists('featured', $filters) && $filters['featured'] !== null && $filters['featured'] !== '') {
            $query->where('featured', filter_var($filters['featured'], FILTER_VALIDATE_BOOLEAN));
        }

        return $query->orderByDesc('created_at');
    }
}
