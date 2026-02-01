<?php

namespace App\Repositories;

use App\Models\HeroSlide;
use Illuminate\Database\Eloquent\Builder;

class HeroSlideRepository extends BaseRepository
{
    public function __construct(HeroSlide $model)
    {
        parent::__construct($model);
    }

    public function list(array $filters = []): Builder
    {
        $query = $this->query();

        if (!empty($filters['active'])) {
            $query->where('active', true);
        }

        return $query->orderBy('sort_order');
    }
}
