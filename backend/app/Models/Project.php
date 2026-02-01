<?php

namespace App\Models;

use App\Models\Concerns\NormalizesMediaPaths;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory, HasUuids, NormalizesMediaPaths;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'title',
        'slug',
        'type',
        'status',
        'thumbnail',
        'banner_image',
        'description',
        'synopsis',
        'release_date',
        'featured',
    ];

    protected $casts = [
        'release_date' => 'date',
        'featured' => 'boolean',
    ];

    public function credits()
    {
        return $this->hasMany(ProjectCredit::class);
    }

    public function mediaItems()
    {
        return $this->hasMany(MediaItem::class, 'project_id');
    }

    public function getThumbnailAttribute($value)
    {
        return $this->normalizeMediaPath($value);
    }

    public function getBannerImageAttribute($value)
    {
        return $this->normalizeMediaPath($value);
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }
}
