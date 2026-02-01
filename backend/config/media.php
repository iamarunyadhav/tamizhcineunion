<?php

return [
    'max_upload_mb' => env('MEDIA_MAX_UPLOAD_MB', 200),
    'allowed_mimes' => [
        'image/jpeg',
        'image/png',
        'image/webp',
        'image/gif',
        'video/mp4',
        'video/webm',
        'audio/mpeg',
        'audio/wav',
        'audio/x-wav',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
];
