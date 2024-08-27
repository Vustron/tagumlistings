<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $role)
    {

        $user = $request->user();

        if ($user && $user->isCorrectRole($role)) {
            return $next($request);
        }

        return response()->json(['message' => 'Unauthorized'], 403);
    }
}
