<?php

namespace App\Repositories;

use App\Models\MediaCategory;

class MediaCategoryRepository extends BaseRepository
{
    public function __construct(MediaCategory $model)
    {
        parent::__construct($model);
    }
}
