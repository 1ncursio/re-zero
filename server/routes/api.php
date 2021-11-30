<?php

use App\Http\Controllers\CommentController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\RegisterController;
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

// Route::post('register', [RegisterController::class, 'register']);
// Route::post('login', [RegisterController::class, 'login']);

Route::middleware('auth:sanctum')->get('/user', [UserController::class, 'user']);
Route::prefix('posts')->group(function () {
    Route::get('/', [PostController::class, 'index']);
    Route::get('/{post}', [PostController::class, 'show']);
    Route::middleware('auth:sanctum')->post('/', [PostController::class, 'store']);
    Route::middleware('auth:sanctum')->put('/{post}', [PostController::class, 'update']);
    Route::middleware('auth:sanctum')->delete('/{post}', [PostController::class, 'destroy']);

    Route::get('/{post}/comments', [CommentController::class, 'index']);
    Route::middleware('auth:sanctum')->post('/{post}/comments', [CommentController::class, 'store']);
    Route::middleware('auth:sanctum')->put('/{post}/comments/{comment}', [CommentController::class, 'update']);
    Route::middleware('auth:sanctum')->delete('/{post}/comments/{comment}', [CommentController::class, 'destroy']);

    Route::middleware('auth:sanctum')->post('/{post}/likes', [PostController::class, 'like']);
    Route::middleware('auth:sanctum')->delete('/{post}/likes', [PostController::class, 'unlike']);

    Route::middleware('auth:sanctum')->post('/{post}/comments/{comment}/likes', [CommentController::class, 'like']);
    Route::middleware('auth:sanctum')->delete('/{post}/comments/{comment}/likes', [CommentController::class, 'unlike']);

    Route::middleware('auth:sanctum')->post('/{post}/comments/{comment}/replies', [CommentController::class, 'reply']);
    Route::middleware('auth:sanctum')->delete('/{post}/comments/{comment}/replies/{reply}', [CommentController::class, 'unreply']);

    Route::middleware('auth:sanctum')->post('/{post}/comments/{comment}/replies/{reply}/likes', [CommentController::class, 'like']);
    Route::middleware('auth:sanctum')->delete('/{post}/comments/{comment}/replies/{reply}/likes', [CommentController::class, 'unlike']);
});
