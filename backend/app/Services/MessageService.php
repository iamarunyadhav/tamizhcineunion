<?php

namespace App\Services;

use App\Models\ContactMessage;
use App\Repositories\MessageRepository;

class MessageService
{
    public function __construct(private readonly MessageRepository $repository)
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

    public function create(array $data): ContactMessage
    {
        return $this->repository->create($data);
    }

    public function update(ContactMessage $message, array $data): ContactMessage
    {
        return $this->repository->update($message, $data);
    }

    public function delete(ContactMessage $message): void
    {
        $this->repository->delete($message);
    }
}
