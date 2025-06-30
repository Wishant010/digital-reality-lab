import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { Suspense, lazy } from 'react';

const HomePage = lazy(() => import('./Pages/LandinPage/FirstScreen'));

// Error fallback component
function ErrorFallback({ error, resetErrorBoundary }: { 
  error: Error; 
  resetErrorBoundary: () => void;
}) {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        <div className="mb-6">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
            <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Oeps, er ging iets mis!</h1>
          <p className="text-gray-400 mb-6">
            Er is een onverwachte fout opgetreden. Probeer de pagina opnieuw te laden.
          </p>
          <button
            onClick={resetErrorBoundary}
            className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors duration-200"
          >
            Probeer opnieuw
          </button>
        </div>
        {process.env.NODE_ENV === 'development' && (
          <details className="text-left mt-6 p-4 bg-gray-800 rounded-lg">
            <summary className="text-red-400 cursor-pointer mb-2">Error Details (Development)</summary>
            <pre className="text-xs text-gray-300 overflow-auto">
              {error.message}
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, errorInfo) => {
        // Log error in production (you can add your logging service here)
        console.error('App Error:', error, errorInfo);
      }}
      onReset={() => {
        // Clear any cached data or reset app state if needed
        window.location.reload();
      }}
    >
      <Router>
        <Suspense fallback={<div className="p-4 text-center text-white">Loading...</div>}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            {/* Future routes will be added here */}
            {/* <Route path="/experiments" element={<ExperimentsPage />} /> */}
            {/* <Route path="/about" element={<AboutPage />} /> */}
            {/* <Route path="/contact" element={<ContactPage />} /> */}
            {/* <Route path="/playground" element={<PlaygroundPage />} /> */}
            {/* <Route path="/testimonials" element={<TestimonialsPage />} /> */}
          </Routes>
        </Suspense>
      </Router>
    </ErrorBoundary>
  );
}

export default App;