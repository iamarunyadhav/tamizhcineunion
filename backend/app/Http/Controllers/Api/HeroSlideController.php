<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\HeroSlide;
use App\Services\HeroSlideService;
use Illuminate\Http\Request;

class HeroSlideController extends Controller
{
    public function __construct(private readonly HeroSlideService $service)
    {
    }

    public function index(Request $request)
    {
        $slides = $this->service->paginate($request->all());
        return response()->json($slides);
    }

    public function show(HeroSlide $heroSlide)
    {
        return response()->json($heroSlide);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'subtitle' => ['nullable', 'string'],
            'image' => ['required', 'string', 'max:2048'],
            'video' => ['nullable', 'string', 'max:2048'],
            'cta_text' => ['nullable', 'string', 'max:255'],
            'cta_link' => ['nullable', 'string', 'max:2048'],
            'sort_order' => ['integer'],
            'active' => ['boolean'],
        ]);

        $slide = $this->service->create($data);

        return response()->json($slide, 201);
    }

    public function update(Request $request, HeroSlide $heroSlide)
    {
        $data = $request->validate([
            'title' => ['sometimes', 'string', 'max:255'],
            'subtitle' => ['nullable', 'string'],
            'image' => ['sometimes', 'string', 'max:2048'],
            'video' => ['nullable', 'string', 'max:2048'],
            'cta_text' => ['nullable', 'string', 'max:255'],
            'cta_link' => ['nullable', 'string', 'max:2048'],
            'sort_order' => ['integer'],
            'active' => ['boolean'],
        ]);

        $slide = $this->service->update($heroSlide, $data);

        return response()->json($slide);
    }

    public function destroy(HeroSlide $heroSlide)
    {
        $this->service->delete($heroSlide);
        return response()->json(status: 204);
    }
}
