<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use App\Services\MessageService;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function __construct(private readonly MessageService $service)
    {
    }

    public function index(Request $request)
    {
        $messages = $this->service->paginate($request->all());
        return response()->json($messages);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email'],
            'phone' => ['nullable', 'string', 'max:255'],
            'message' => ['required', 'string'],
        ]);

        $message = $this->service->create($data);

        return response()->json($message, 201);
    }

    public function update(Request $request, ContactMessage $contactMessage)
    {
        $data = $request->validate([
            'read' => ['boolean'],
        ]);

        $message = $this->service->update($contactMessage, $data);

        return response()->json($message);
    }

    public function destroy(ContactMessage $contactMessage)
    {
        $this->service->delete($contactMessage);
        return response()->json(status: 204);
    }
}
