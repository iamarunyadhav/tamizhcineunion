<?php

namespace App\Models;

use App\Models\Concerns\NormalizesMediaPaths;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MemberProfile extends Model
{
    use HasFactory, HasUuids, NormalizesMediaPaths;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'user_id',
        'membership_application_id',
        'date_of_birth',
        'phone',
        'location',
        'category',
        'skills',
        'bio',
        'portfolio_links',
        'profile_photo',
    ];

    protected $casts = [
        'skills' => 'array',
        'portfolio_links' => 'array',
        'date_of_birth' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function getProfilePhotoAttribute($value)
    {
        return $this->normalizeMediaPath($value);
    }
}
