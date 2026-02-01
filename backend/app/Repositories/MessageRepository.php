<?php

namespace App\Repositories;

use App\Models\ContactMessage;
use Illuminate\Database\Eloquent\Builder;

class MessageRepository extends BaseRepository
{
    public function __construct(ContactMessage $model)
    {
        parent::__construct($model);
    }

    public function list(array $filters = []): Builder
    {
        $query = $this->query();

        if (!empty($filters['read'])) {
            $query->where('read', (bool) $filters['read']);
        }

        if (!empty($filters['search'])) {
            $query->where(function (Builder $q) use ($filters) {
                $q->where('name', 'like', '%'.$filters['search'].'%')
                    ->orWhere('email', 'like', '%'.$filters['search'].'%')
                    ->orWhere('message', 'like', '%'.$filters['search'].'%');
            });
        }

        return $query->orderByDesc('created_at');
    }
}
