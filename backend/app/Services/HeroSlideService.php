<?php

namespace App\Services;

use App\Models\HeroSlide;
use App\Repositories\HeroSlideRepository;

class HeroSlideService
{
    public function __construct(private readonly HeroSlideRepository $repository)
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

    public function create(array $data): HeroSlide
    {
        return $this->repository->create($data);
    }

    public function update(HeroSlide $slide, array $data): HeroSlide
    {
        return $this->repository->update($slide, $data);
    }

    public function delete(HeroSlide $slide): void
    {
        $this->repository->delete($slide);
    }
}
