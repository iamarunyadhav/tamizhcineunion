<?php

namespace App\Models\Concerns;

use Illuminate\Support\Str;

trait NormalizesMediaPaths
{
    protected function normalizeMediaPath(?string $value): ?string
    {
        if (empty($value) || !is_string($value)) {
            return $value;
        }

        if (str_starts_with($value, 'http://') || str_starts_with($value, 'https://') || str_starts_with($value, '//')) {
            return $value;
        }

        $normalized = ltrim($value, '/');

        if (Str::contains($normalized, 'storage/app/public/')) {
            $normalized = Str::after($normalized, 'storage/app/public/');
        }

        if (Str::startsWith($normalized, 'public/storage/')) {
            $normalized = Str::after($normalized, 'public/');
        }

        if (Str::startsWith($normalized, 'storage/')) {
            return asset($normalized);
        }

        return asset('storage/'.$normalized);
    }
}
