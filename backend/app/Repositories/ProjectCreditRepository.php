<?php

namespace App\Repositories;

use App\Models\ProjectCredit;

class ProjectCreditRepository extends BaseRepository
{
    public function __construct(ProjectCredit $model)
    {
        parent::__construct($model);
    }
}
