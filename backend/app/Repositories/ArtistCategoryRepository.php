<?php

namespace App\Repositories;

use App\Models\ArtistCategory;

class ArtistCategoryRepository extends BaseRepository
{
    public function __construct(ArtistCategory $model)
    {
        parent::__construct($model);
    }
}
