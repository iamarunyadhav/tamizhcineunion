<?php

namespace App\Repositories;

use App\Models\ArtistMedia;
use Illuminate\Database\Eloquent\Builder;

class ArtistMediaRepository extends BaseRepository
{
    public function __construct(ArtistMedia $model)
    {
        parent::__construct($model);
    }

    public function listForArtist(string $artistId): Builder
    {
        return $this->query()
            ->where('artist_id', $artistId)
            ->orderBy('position')
            ->orderBy('created_at');
    }
}
