<?php

namespace App\Models;

use App\Models\Concerns\NormalizesMediaPaths;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HeroSlide extends Model
{
    use HasFactory, HasUuids, NormalizesMediaPaths;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'title',
        'subtitle',
        'image',
        'video',
        'cta_text',
        'cta_link',
        'sort_order',
        'active',
    ];

    protected $casts = [
        'active' => 'boolean',
    ];

    public function getImageAttribute($value)
    {
        return $this->normalizeMediaPath($value);
    }
}
