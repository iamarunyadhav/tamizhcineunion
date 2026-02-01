<?php

namespace App\Services;

use App\Models\Project;
use App\Repositories\ProjectRepository;
use Illuminate\Support\Str;

class ProjectService
{
    public function __construct(private readonly ProjectRepository $repository)
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

    public function create(array $data): Project
    {
        $data['slug'] = $data['slug'] ?? Str::slug($data['title']);
        return $this->repository->create($data);
    }

    public function update(Project $project, array $data): Project
    {
        if (empty($data['slug']) && !empty($data['title'])) {
            $data['slug'] = Str::slug($data['title']);
        }

        return $this->repository->update($project, $data);
    }

    public function delete(Project $project): void
    {
        $this->repository->delete($project);
    }
}
