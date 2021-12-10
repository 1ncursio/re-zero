<?php

use App\Http\Controllers\CommentController;
use App\Http\Controllers\HistoryController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\RegisterController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->prefix('user')->group(function () {
    Route::get('/', [UserController::class, 'user']);
    Route::post('/image', [UserController::class, 'updateImage']);
    Route::put('/profile', [UserController::class, 'updateProfile']);
});

Route::middleware('auth:sanctum')->prefix('posts')->group(function () {
    Route::get('/', [PostController::class, 'index']);
    Route::get('/{post}', [PostController::class, 'show']);
    Route::post('/', [PostController::class, 'store']);
    Route::put('/{post}', [PostController::class, 'update']);
    Route::delete('/{post}', [PostController::class, 'destroy']);

    Route::get('/{post}/comments', [CommentController::class, 'index']);
    Route::post('/{post}/comments', [CommentController::class, 'store']);
    Route::put('/{post}/comments/{comment}', [CommentController::class, 'update']);
    Route::delete('/{post}/comments/{comment}', [CommentController::class, 'destroy']);

    Route::post('/{post}/likes', [PostController::class, 'toggleLike']);
    // Route::post('/image', [PostController::class, 'uploadImage']);
    Route::post('/image', [PostController::class, 'uploadImage']);

    Route::post('/{post}/comments/{comment}/likes', [CommentController::class, 'toggleLike']);

    Route::get('/{post}/comments/{comment}/replies', [CommentController::class, 'replies']);
    Route::post('/{post}/comments/{comment}/replies', [CommentController::class, 'storeReply']);
    Route::put('/{post}/comments/{comment}/replies/{reply}', [CommentController::class, 'updateReply']);
    Route::delete('/{post}/comments/{comment}/replies/{reply}', [CommentController::class, 'destoryReply']);

    Route::post('/{post}/comments/{comment}/replies/{reply}/likes', [CommentController::class, 'toggleLikeReply']);
});

Route::middleware('auth:sanctum')->get('/search', [SearchController::class, 'query']);

Route::middleware('auth:sanctum')->prefix('history')->group(function () {
    Route::get('/ai', [HistoryController::class, 'indexAI']);
    Route::post('/ai', [HistoryController::class, 'storeHistoryAI']);

    Route::get('/ai/user', [HistoryController::class, 'userHistoryAI']);
});
