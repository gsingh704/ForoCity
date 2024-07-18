<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HubController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\PostVoteController;
use App\Http\Controllers\ResponseController;
use App\Http\Controllers\Auth\UserController;
use App\Http\Controllers\UserHubRelController;
use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\ConversationController;
use App\Http\Controllers\ResponseVoteController;
use App\Http\Controllers\Auth\PasswordController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\VerifyEmailController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\ConfirmablePasswordController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\EmailVerificationPromptController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;

Route::middleware('guest')->group(function () {
    Route::get('register', [RegisteredUserController::class, 'create'])
        ->name('register');

    Route::post('register', [RegisteredUserController::class, 'store']);

    Route::get('login', [AuthenticatedSessionController::class, 'create'])
        ->name('login');

    Route::post('login', [AuthenticatedSessionController::class, 'store']);

    Route::get('forgot-password', [PasswordResetLinkController::class, 'create'])
        ->name('password.request');

    Route::post('forgot-password', [PasswordResetLinkController::class, 'store'])
        ->name('password.email');

    Route::get('reset-password/{token}', [NewPasswordController::class, 'create'])
        ->name('password.reset');

    Route::post('reset-password', [NewPasswordController::class, 'store'])
        ->name('password.store');
});

Route::middleware('auth')->group(function () {
    Route::get('verify-email', EmailVerificationPromptController::class)
        ->name('verification.notice');

    Route::get('verify-email/{id}/{hash}', VerifyEmailController::class)
        ->middleware(['signed', 'throttle:6,1'])
        ->name('verification.verify');

    Route::post('email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
        ->middleware('throttle:6,1')
        ->name('verification.send');

    Route::get('confirm-password', [ConfirmablePasswordController::class, 'show'])
        ->name('password.confirm');

    Route::post('confirm-password', [ConfirmablePasswordController::class, 'store']);

    Route::put('password', [PasswordController::class, 'update'])->name('password.update');

    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])
        ->name('logout');


    //user defined routes
    Route::get('/me/hub', [HubController::class, 'userhub'])->name('hub.userhub');
    Route::get('/hub/create', [HubController::class, 'create'])->name('hub.create');
    Route::post('/hub/store', [HubController::class, 'store'])->name('hub.store');
    Route::delete('/hub/destroy', [HubController::class, 'destroy'])->name('hub.destroy');
    Route::get('/h/{hub:name}/edit', [HubController::class, 'edit'])->name('hub.edit');
    Route::post('/hub/update', [HubController::class, 'update'])->name('hub.update');

    Route::get('/h/{hub:name}/post/create', [PostController::class, 'create'])->name('post.create');
    Route::post('/post/store', [PostController::class, 'store'])->name('post.store');
    Route::delete('/post/destroy', [PostController::class, 'destroy'])->name('post.destroy');
    Route::get('/h/{hub:name}/p/{post:id}/edit', [PostController::class, 'edit'])->name('post.edit');
    Route::post('/post/update', [PostController::class, 'update'])->name('post.update');

    Route::post('/response/store', [ResponseController::class, 'store'])->name('response.store');
    Route::delete('/response/destroy', [ResponseController::class, 'destroy'])->name('response.destroy');

    Route::post('/userhubrel/store', [UserHubRelController::class, 'store'])->name('userhub.store');
    Route::post('/post/vote', [PostVoteController::class, 'store'])->name('postvote.store');
    Route::post('/response/vote', [ResponseVoteController::class, 'store'])->name('responsevote.store');

    //Relationship routes
    Route::get('/u/{user:name}/c/', [ConversationController::class, 'index'])->name('conversation.index');
    Route::get('/u/{user_name}/c/{otheruser_name}', [ConversationController::class, 'show'])->name('conversation.show');
    Route::post('/conversation/store', [ConversationController::class, 'store'])->name('conversation.store');
});

//is admin middleware
Route::middleware(['auth', 'admin'])->group(function () {
    Route::get('/admin', [AdminController::class, 'index'])->name('admin.index');
    //admin user routes
    Route::get('/admin/user', [UserController::class, 'index'])->name('user.index');
    Route::delete('/admin/user/', [UserController::class, 'destroy'])->name('user.destroy');

});
