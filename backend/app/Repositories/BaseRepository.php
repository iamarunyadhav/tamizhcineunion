<?php

namespace App\Repositories;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;

abstract class BaseRepository
{
    protected Model $model;

    public function __construct(Model $model)
    {
        $this->model = $model;
    }

    public function query(): Builder
    {
        return $this->model->newQuery();
    }

    public function paginate(Builder $query, int $perPage = 15): LengthAwarePaginator
    {
        return $query->paginate($perPage);
    }

    public function findById(string $id): Model
    {
        return $this->query()->findOrFail($id);
    }

    public function create(array $data): Model
    {
        return $this->model->create($data);
    }

    public function update(Model $model, array $data): Model
    {
        $model->update($data);
        return $model;
    }

    public function delete(Model $model): void
    {
        $model->delete();
    }
}
