<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProjectCredit;
use App\Services\ProjectCreditService;
use Illuminate\Http\Request;

class ProjectCreditController extends Controller
{
    public function __construct(private readonly ProjectCreditService $service)
    {
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'project_id' => ['required', 'exists:projects,id'],
            'artist_id' => ['required', 'exists:artists,id'],
            'role' => ['required', 'string', 'max:255'],
        ]);

        $credit = $this->service->create($data);

        return response()->json($credit, 201);
    }

    public function update(Request $request, ProjectCredit $projectCredit)
    {
        $data = $request->validate([
            'project_id' => ['sometimes', 'exists:projects,id'],
            'artist_id' => ['sometimes', 'exists:artists,id'],
            'role' => ['sometimes', 'string', 'max:255'],
        ]);

        $credit = $this->service->update($projectCredit, $data);

        return response()->json($credit);
    }

    public function destroy(ProjectCredit $projectCredit)
    {
        $this->service->delete($projectCredit);
        return response()->json(status: 204);
    }
}
