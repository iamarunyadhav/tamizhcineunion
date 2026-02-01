<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MembershipApplication;
use App\Services\MembershipService;
use Illuminate\Http\Request;

class MembershipController extends Controller
{
    public function __construct(private readonly MembershipService $service)
    {
    }

    public function index(Request $request)
    {
        $applications = $this->service->paginate($request->all());
        return response()->json($applications);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email'],
            'date_of_birth' => ['nullable', 'date'],
            'location' => ['nullable', 'string', 'max:255'],
            'category' => ['nullable', 'string', 'max:255'],
            'skills' => ['nullable', 'array'],
            'bio' => ['nullable', 'string'],
            'portfolio_links' => ['nullable', 'array'],
            'profile_photo' => ['nullable', 'string', 'max:2048'],
        ]);

        $application = $this->service->create($data);

        return response()->json($application, 201);
    }

    public function update(Request $request, MembershipApplication $membershipApplication)
    {
        $data = $request->validate([
            'status' => ['nullable', 'string', 'max:255'],
        ]);

        $application = $this->service->update($membershipApplication, $data);

        return response()->json($application);
    }

    public function destroy(MembershipApplication $membershipApplication)
    {
        $this->service->delete($membershipApplication);
        return response()->json(status: 204);
    }
}
