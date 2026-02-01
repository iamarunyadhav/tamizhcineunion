<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class UploadController extends Controller
{
    public function store(Request $request)
    {
        $maxMb = (int) config('media.max_upload_mb', 200);
        $allowedMimes = config('media.allowed_mimes', []);

        $validated = $request->validate([
            'file' => ['required_without:url', 'file', 'max:'.($maxMb * 1024), 'mimetypes:'.implode(',', $allowedMimes)],
            'url' => ['required_without:file', 'nullable', 'url'],
            'folder' => ['nullable', 'string', 'max:255'],
        ]);

        $folder = trim($request->input('folder', 'uploads'), "/\\");
        if ($folder === '') {
            $folder = 'uploads';
        }
        $uuidName = Str::uuid()->toString();

        // If a URL is provided, just return it (no download needed)
        if (!empty($validated['url'])) {
            return response()->json([
                'url' => $validated['url'],
                'path' => $validated['url'],
                'source' => 'external',
            ]);
        }

        // Handle file upload
        $file = $request->file('file');

        $storageRoot = public_path('storage');
        if (!File::isDirectory($storageRoot)) {
            File::makeDirectory($storageRoot, 0755, true);
        }

        $targetDir = $storageRoot.DIRECTORY_SEPARATOR.$folder;
        if (!File::isDirectory($targetDir)) {
            File::makeDirectory($targetDir, 0755, true);
        }

        if ($folder === 'media-thumbnails') {
            $filename = "{$uuidName}.jpeg";
        } else {
            $extension = $file->getClientOriginalExtension();
            $filename = $extension ? "{$uuidName}.{$extension}" : $uuidName;
        }

        $file->move($targetDir, $filename);
        $storedPath = $targetDir.DIRECTORY_SEPARATOR.$filename;
        @chmod($storedPath, 0644);

        $relativePath = 'storage/'.$folder.'/'.$filename;

        return response()->json([
            'url' => asset($relativePath),
            'path' => $relativePath,
            'source' => 'local',
        ]);
    }
}
