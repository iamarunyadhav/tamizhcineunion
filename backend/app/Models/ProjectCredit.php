<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProjectCredit extends Model
{
    use HasFactory, HasUuids;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'project_id',
        'artist_id',
        'role',
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function artist()
    {
        return $this->belongsTo(Artist::class);
    }
}
