<?php

namespace App\Repositories;

use App\Models\Project;
use Illuminate\Database\Eloquent\Builder;

class ProjectRepository extends BaseRepository
{
    public function __construct(Project $model)
    {
        parent::__construct($model);
    }

    public function list(array $filters = []): Builder
    {
        $query = $this->query()->with('credits.artist');

        if (!empty($filters['search'])) {
            $query->where(function (Builder $q) use ($filters) {
                $q->where('title', 'like', '%'.$filters['search'].'%')
                    ->orWhere('description', 'like', '%'.$filters['search'].'%');
            });
        }

        if (!empty($filters['type'])) {
            $query->where('type', $filters['type']);
        }

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['featured'])) {
            $query->where('featured', true);
        }

        return $query->orderByDesc('created_at');
    }
}
