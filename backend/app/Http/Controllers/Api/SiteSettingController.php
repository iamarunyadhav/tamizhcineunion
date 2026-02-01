<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\Request;

class SiteSettingController extends Controller
{
    public function theme()
    {
        $setting = SiteSetting::where('key', 'theme_preset')->first();
        $id = $setting?->value['id'] ?? null;

        return response()->json(['id' => $id]);
    }

    public function updateTheme(Request $request)
    {
        $data = $request->validate([
            'id' => ['required', 'string', 'max:100'],
        ]);

        $setting = SiteSetting::updateOrCreate(
            ['key' => 'theme_preset'],
            ['value' => ['id' => $data['id']]]
        );

        return response()->json(['id' => $setting->value['id'] ?? $data['id']]);
    }
}
