<?php

use App\Http\Controllers\Api\ArtistController;
use App\Http\Controllers\Api\ArtistCategoryController;
use App\Http\Controllers\Api\ArtistGalleryController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BirthdayController;
use App\Http\Controllers\Api\HeroSlideController;
use App\Http\Controllers\Api\MediaController;
use App\Http\Controllers\Api\MediaCategoryController;
use App\Http\Controllers\Api\MembershipController;
use App\Http\Controllers\Api\MemberController;
use App\Http\Controllers\Api\MemberProfileController;
use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\ProjectCreditController;
use App\Http\Controllers\Api\SiteSettingController;
use App\Http\Controllers\Api\UploadController;
use Illuminate\Support\Facades\Route;

Route::get('/health', function () {
    return ['status' => 'ok', 'app' => config('app.name')];
});

// Auth
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/register', [AuthController::class, 'register']);
Route::get('/auth/admin-exists', [AuthController::class, 'adminExists']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('member/profile', [MemberProfileController::class, 'show']);
    Route::put('member/profile', [MemberProfileController::class, 'update']);
});

// Public content
Route::apiResource('artists', ArtistController::class)->only(['index', 'show']);
Route::apiResource('artist-categories', ArtistCategoryController::class)->only(['index']);
Route::get('artists/{artist}/gallery', [ArtistGalleryController::class, 'index']);
Route::apiResource('projects', ProjectController::class)->only(['index', 'show']);
Route::apiResource('media', MediaController::class)->only(['index', 'show']);
Route::apiResource('media-categories', MediaCategoryController::class)->only(['index']);
Route::apiResource('posts', PostController::class)->only(['index', 'show']);
Route::apiResource('hero-slides', HeroSlideController::class)->only(['index', 'show']);
Route::get('site-settings/theme', [SiteSettingController::class, 'theme']);
Route::get('birthdays/today', [BirthdayController::class, 'today']);

Route::post('membership-applications', [MembershipController::class, 'store']);
Route::post('contact-messages', [MessageController::class, 'store']);
Route::post('upload', [UploadController::class, 'store']);

// Admin-protected content
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::apiResource('artists', ArtistController::class)->except(['index', 'show']);
    Route::apiResource('artist-categories', ArtistCategoryController::class)->except(['index', 'show']);
    Route::apiResource('artists.gallery', ArtistGalleryController::class)->only(['store', 'update', 'destroy']);
    Route::apiResource('projects', ProjectController::class)->except(['index', 'show']);
    Route::apiResource('media', MediaController::class)->except(['index', 'show']);
    Route::apiResource('media-categories', MediaCategoryController::class)->except(['index', 'show']);
    Route::apiResource('posts', PostController::class)->except(['index', 'show']);
    Route::apiResource('hero-slides', HeroSlideController::class)->except(['index', 'show']);
    Route::apiResource('project-credits', ProjectCreditController::class)->only(['store', 'update', 'destroy']);
    Route::apiResource('members', MemberController::class)->only(['index', 'show', 'store', 'update', 'destroy']);

    Route::apiResource('membership-applications', MembershipController::class)->only(['index', 'update', 'destroy']);
    Route::apiResource('contact-messages', MessageController::class)->only(['index', 'update', 'destroy']);
    Route::put('site-settings/theme', [SiteSettingController::class, 'updateTheme']);
});
