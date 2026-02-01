<?php

namespace App\Models;

use App\Models\Concerns\NormalizesMediaPaths;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MembershipApplication extends Model
{
    use HasFactory, HasUuids, NormalizesMediaPaths;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'name',
        'phone',
        'email',
        'date_of_birth',
        'location',
        'category',
        'skills',
        'bio',
        'portfolio_links',
        'profile_photo',
        'status',
    ];

    protected $casts = [
        'skills' => 'array',
        'portfolio_links' => 'array',
        'date_of_birth' => 'date',
    ];

    public function getProfilePhotoAttribute($value)
    {
        return $this->normalizeMediaPath($value);
    }
}
