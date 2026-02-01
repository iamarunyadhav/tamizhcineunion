<?php

namespace App\Repositories;

use App\Models\Post;
use Illuminate\Database\Eloquent\Builder;

class PostRepository extends BaseRepository
{
    public function __construct(Post $model)
    {
        parent::__construct($model);
    }

    public function list(array $filters = []): Builder
    {
        $query = $this->query();

        if (!empty($filters['search'])) {
            $query->where(function (Builder $q) use ($filters) {
                $q->where('title', 'like', '%'.$filters['search'].'%')
                    ->orWhere('excerpt', 'like', '%'.$filters['search'].'%');
            });
        }

        if (!empty($filters['category'])) {
            $query->where('category', $filters['category']);
        }

        if (!empty($filters['published'])) {
            $query->where('published', true);
        }

        if (!empty($filters['featured'])) {
            $query->where('featured', true);
        }

        return $query->orderByDesc('published_at')->orderByDesc('created_at');
    }
}
