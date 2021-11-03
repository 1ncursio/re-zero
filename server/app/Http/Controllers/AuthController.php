<?php

namespace App\Http\Controllers;

use App\Models\User;
use Auth;
use Hash;
use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;

class AuthController extends BaseController
{
    public function redirect()
    {
        return Socialite::driver('google')->redirect();
    }

    public function callback()
    {
        try {
            $user = Socialite::driver('google')->user();

            $saved_user = User::firstOrCreate(
                ['email' => $user->getEmail()],
                [
                    'name' => $user->getNickname(),
                    'email' => $user->getEmail(),
                    'image_url' => $user->getAvatar(),
                    'password' => Hash::make($user->getName() . '@' . $user->getId())
                ]
            );

            Auth::login($saved_user);

            $success['user'] = $saved_user;
            // return $this->sendResponse($success, '로그인 성공');
            return redirect()->away('http://localhost:3000');
        } catch (\Throwable $th) {
            return $this->sendError('error occured.', ['error' => 'Internal Server Error']);
            // throw $th;
        }
    }

    public function logout()
    {
        Auth::logout();
    }
}
