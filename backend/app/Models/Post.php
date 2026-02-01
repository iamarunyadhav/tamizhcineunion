<?php

namespace App\Models;

use App\Models\Concerns\NormalizesMediaPaths;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    use HasFactory, HasUuids, NormalizesMediaPaths;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'title',
        'slug',
        'excerpt',
        'content',
        'cover_image',
        'category',
        'tags',
        'author',
        'featured',
        'published',
        'published_at',
    ];

    protected $casts = [
        'tags' => 'array',
        'featured' => 'boolean',
        'published' => 'boolean',
        'published_at' => 'datetime',
    ];

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function getCoverImageAttribute($value)
    {
        return $this->normalizeMediaPath($value);
    }
}
