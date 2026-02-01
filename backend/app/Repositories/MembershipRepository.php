<?php

namespace App\Repositories;

use App\Models\MembershipApplication;
use Illuminate\Database\Eloquent\Builder;

class MembershipRepository extends BaseRepository
{
    public function __construct(MembershipApplication $model)
    {
        parent::__construct($model);
    }

    public function list(array $filters = []): Builder
    {
        $query = $this->query();

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['search'])) {
            $query->where(function (Builder $q) use ($filters) {
                $q->where('name', 'like', '%'.$filters['search'].'%')
                    ->orWhere('email', 'like', '%'.$filters['search'].'%');
            });
        }

        return $query->orderByDesc('created_at');
    }
}
