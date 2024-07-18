<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HubController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ResponseController;
use App\Http\Controllers\Auth\UserController;
use App\Http\Controllers\HomeController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', [HomeController::class, 'index']);

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::get('/hub/index', [HubController::class, 'index'])->name('hub.index');
Route::get('/h/{hub:name}', [HubController::class, 'show'])->name('hub.show');

Route::get('/api/h/{hub:name}/post', [PostController::class, 'getPostsByHubName']);
Route::get('/h/{hub:name}/p/{post:id}', [PostController::class, 'show'])->name('post.show');

Route::get('/u/{user:name}', [UserController::class, 'show'])->name('user.show');
Route::get('/api/u/{user:name}/responses', [ResponseController::class, 'getResponsesByUserName']);


//test login for debugging
Route::get('/testlogin/{id}', function ($id) {
    //set the user to be logged in as user id 1
    Auth::loginUsingId($id);
    return redirect('/');

});


require __DIR__ . '/auth.php';
