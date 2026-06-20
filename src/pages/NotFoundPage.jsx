// src/pages/NotFoundPage.jsx
// Standard 404 page screen.

import React from 'react';
import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 text-center">
      <div className="max-w-md w-full space-y-6 bg-white p-8 border border-slate-200 rounded-lg shadow-sm">
        <div className="inline-flex p-4 bg-slate-50 border border-slate-100 text-slate-400 rounded-full">
          <Compass className="w-12 h-12" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">404 - Page Not Found</h2>
        <p className="text-slate-600 text-sm leading-relaxed">
          The view path you are attempting to reach does not exist or has been relocated in this release.
        </p>
        <div className="pt-2">
          <Link
            to="/dashboard"
            className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-semibold rounded-md shadow-sm text-white bg-brand-600 hover:bg-brand-700 focus:outline-none transition-colors"
          >
            Go back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
