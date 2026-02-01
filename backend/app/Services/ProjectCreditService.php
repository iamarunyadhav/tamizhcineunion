<?php

namespace App\Services;

use App\Models\ProjectCredit;
use App\Repositories\ProjectCreditRepository;

class ProjectCreditService
{
    public function __construct(private readonly ProjectCreditRepository $repository)
    {
    }

    public function create(array $data): ProjectCredit
    {
        return $this->repository->create($data);
    }

    public function update(ProjectCredit $credit, array $data): ProjectCredit
    {
        return $this->repository->update($credit, $data);
    }

    public function delete(ProjectCredit $credit): void
    {
        $this->repository->delete($credit);
    }
}
