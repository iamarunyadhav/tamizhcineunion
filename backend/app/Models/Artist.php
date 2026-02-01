<?php

namespace App\Models;

use App\Models\Concerns\NormalizesMediaPaths;
use App\Models\ArtistMedia;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Artist extends Model
{
    use HasFactory, HasUuids, NormalizesMediaPaths;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'name',
        'slug',
        'date_of_birth',
        'photo',
        'cover_image',
        'category_id',
        'location',
        'bio',
        'skills',
        'social_facebook',
        'social_instagram',
        'social_youtube',
        'featured',
    ];

    protected $casts = [
        'skills' => 'array',
        'featured' => 'boolean',
        'date_of_birth' => 'date',
    ];

    public function category()
    {
        return $this->belongsTo(ArtistCategory::class, 'category_id');
    }

    public function gallery()
    {
        return $this->hasMany(ArtistMedia::class)->orderBy('position')->orderBy('created_at');
    }

    public function projectCredits()
    {
        return $this->hasMany(ProjectCredit::class);
    }

    public function mediaItems()
    {
        return $this->hasMany(MediaItem::class, 'artist_id');
    }

    public function getPhotoAttribute($value)
    {
        return $this->normalizeMediaPath($value);
    }

    public function getCoverImageAttribute($value)
    {
        return $this->normalizeMediaPath($value);
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }
}
