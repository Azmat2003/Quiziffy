import React from "react";

import { Link } from "react-router";

function Unauthorized() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">

      <div className="relative max-w-xl w-full text-center">

        {/* Glow */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 h-60 w-60 rounded-full bg-violet-600/20 blur-3xl" />

        {/* Error Code */}
        <h1 className="relative text-8xl sm:text-9xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400">
          401
        </h1>

        {/* Title */}
        <h2 className="mt-6 text-3xl sm:text-4xl font-bold">
          Login Required
        </h2>

        {/* Description */}
        <p className="mt-4 text-slate-400 text-base sm:text-lg leading-relaxed">
          You need to be logged in to access this page.
          Sign in to continue exploring your quizzes, dashboard,
          analytics and more.
        </p>

        {/* Divider */}
        <div className="my-8 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">

          <Link
            to="/login"
            className="w-full sm:w-auto rounded-xl bg-violet-600 px-7 py-3 font-semibold
                       transition-all duration-300
                       hover:bg-violet-500
                       hover:scale-105
                       active:scale-95
                       shadow-lg shadow-violet-600/20"
          >
            Login
          </Link>

          <Link
            to="/"
            className="w-full sm:w-auto rounded-xl border border-white/10
                       bg-white/[0.03] px-7 py-3 font-semibold text-slate-300
                       transition-all duration-300
                       hover:bg-white/[0.07]
                       hover:text-white
                       hover:scale-105
                       active:scale-95"
          >
            Back to Home
          </Link>

        </div>

        {/* Small Message */}
        <p className="mt-8 text-sm text-slate-600">
          🔒 This page is protected
        </p>

      </div>

    </div>
  );
}

export default Unauthorized;