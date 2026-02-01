<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Services\ProjectService;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function __construct(private readonly ProjectService $service)
    {
    }

    public function index(Request $request)
    {
        $projects = $this->service->paginate($request->all());
        return response()->json($projects);
    }

    public function show(Project $project)
    {
        return response()->json($project->load('credits.artist', 'mediaItems'));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:projects,slug'],
            'type' => ['required', 'in:film,theatre,music,visual,documentary'],
            'status' => ['required', 'in:ongoing,completed,upcoming'],
            'thumbnail' => ['nullable', 'string', 'max:2048'],
            'banner_image' => ['nullable', 'string', 'max:2048'],
            'description' => ['nullable', 'string'],
            'synopsis' => ['nullable', 'string'],
            'release_date' => ['nullable', 'date'],
            'featured' => ['boolean'],
        ]);

        $project = $this->service->create($data);

        return response()->json($project, 201);
    }

    public function update(Request $request, Project $project)
    {
        $data = $request->validate([
            'title' => ['sometimes', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:projects,slug,'.$project->id.',id'],
            'type' => ['sometimes', 'in:film,theatre,music,visual,documentary'],
            'status' => ['sometimes', 'in:ongoing,completed,upcoming'],
            'thumbnail' => ['nullable', 'string', 'max:2048'],
            'banner_image' => ['nullable', 'string', 'max:2048'],
            'description' => ['nullable', 'string'],
            'synopsis' => ['nullable', 'string'],
            'release_date' => ['nullable', 'date'],
            'featured' => ['boolean'],
        ]);

        $project = $this->service->update($project, $data);

        return response()->json($project);
    }

    public function destroy(Project $project)
    {
        $this->service->delete($project);
        return response()->json(status: 204);
    }
}
