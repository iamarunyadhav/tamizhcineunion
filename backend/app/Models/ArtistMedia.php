<?php

namespace App\Models;

use App\Models\Concerns\NormalizesMediaPaths;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ArtistMedia extends Model
{
    use HasFactory, HasUuids, NormalizesMediaPaths;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'artist_id',
        'type',
        'title',
        'url',
        'thumbnail',
        'focal_point',
        'is_cover_candidate',
        'position',
    ];

    protected $casts = [
        'focal_point' => 'array',
        'is_cover_candidate' => 'boolean',
        'position' => 'integer',
    ];

    public function artist()
    {
        return $this->belongsTo(Artist::class);
    }

    public function getUrlAttribute($value)
    {
        return $this->normalizeMediaPath($value);
    }

    public function getThumbnailAttribute($value)
    {
        return $this->normalizeMediaPath($value);
    }
}
