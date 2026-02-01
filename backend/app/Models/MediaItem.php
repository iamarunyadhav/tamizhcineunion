<?php

namespace App\Models;

use App\Models\Concerns\NormalizesMediaPaths;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MediaItem extends Model
{
    use HasFactory, HasUuids, NormalizesMediaPaths;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'title',
        'slug',
        'type',
        'category_id',
        'thumbnail',
        'url',
        'description',
        'duration',
        'artist_id',
        'project_id',
        'featured',
    ];

    protected $casts = [
        'featured' => 'boolean',
    ];

    public function category()
    {
        return $this->belongsTo(MediaCategory::class, 'category_id');
    }

    public function artist()
    {
        return $this->belongsTo(Artist::class, 'artist_id');
    }

    public function project()
    {
        return $this->belongsTo(Project::class, 'project_id');
    }

    public function getThumbnailAttribute($value)
    {
        return $this->normalizeMediaPath($value);
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }
}
