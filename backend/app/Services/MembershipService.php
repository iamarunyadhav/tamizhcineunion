<?php

namespace App\Services;

use App\Models\MembershipApplication;
use App\Repositories\MembershipRepository;

class MembershipService
{
    public function __construct(private readonly MembershipRepository $repository)
    {
    }

    public function paginate(array $filters)
    {
        $perPage = $filters['per_page'] ?? 15;
        return $this->repository->paginate(
            $this->repository->list($filters),
            $perPage
        );
    }

    public function create(array $data): MembershipApplication
    {
        return $this->repository->create($data);
    }

    public function update(MembershipApplication $application, array $data): MembershipApplication
    {
        return $this->repository->update($application, $data);
    }

    public function delete(MembershipApplication $application): void
    {
        $this->repository->delete($application);
    }
}
