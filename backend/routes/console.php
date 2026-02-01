<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\File;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('media:sync-public', function () {
    $source = storage_path('app/public');
    $destination = public_path('storage');

    if (!File::isDirectory($source)) {
        $this->warn("Source directory not found: {$source}");
        return 0;
    }

    if (!File::isDirectory($destination)) {
        File::makeDirectory($destination, 0755, true);
    }

    $copied = 0;
    foreach (File::allFiles($source) as $file) {
        $relativePath = str_replace($source.DIRECTORY_SEPARATOR, '', $file->getPathname());
        $target = $destination.DIRECTORY_SEPARATOR.$relativePath;
        $targetDir = dirname($target);

        if (!File::isDirectory($targetDir)) {
            File::makeDirectory($targetDir, 0755, true);
        }

        if (!File::exists($target)) {
            File::copy($file->getPathname(), $target);
            @chmod($target, 0644);
            $copied++;
        }
    }

    $this->info("Copied {$copied} file(s) to public storage.");
})->purpose('Copy missing public media files to public/storage');
