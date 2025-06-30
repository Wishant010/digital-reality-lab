import React, { useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";

// Import responsive system
import { useViewport } from "./utils/responsive";
import { ResponsiveContainer } from "./components/ResponsiveLayout";

// Lazy load components for better performance
const HomePage = React.lazy(() => import("./Pages/LandinPage/FirstScreen"));

// Performance monitoring component with responsive features
function PerformanceMonitor({ children }: { children: React.ReactNode }) {
  const { isMobile, isTablet, prefersReducedMotion } = useViewport();

  useEffect(() => {
    // Disable wallet extension injection conflicts
    const disableWalletInjection = () => {
      try {
        // Prevent wallet extensions from interfering
        if (typeof window !== "undefined") {
          // Block common wallet injection points
          Object.defineProperty(window, "ethereum", {
            get() {
              return undefined;
            },
            set() {
              return false;
            },
            configurable: false,
          });

          Object.defineProperty(window, "phantom", {
            get() {
              return undefined;
            },
            set() {
              return false;
            },
            configurable: false,
          });

          Object.defineProperty(window, "keplr", {
            get() {
              return undefined;
            },
            set() {
              return false;
            },
            configurable: false,
          });
        }
      } catch (error) {
        // Silently ignore if already defined
        console.debug("Wallet extension prevention failed:", error);
      }
    };

    // Performance optimizations based on device type
    const optimizeForDevice = () => {
      if (typeof window !== "undefined") {
        // Reduce animations on mobile for better performance
        if (isMobile && !prefersReducedMotion) {
          document.documentElement.style.setProperty("--animation-duration", "0.3s");
        }

        // Optimize rendering on tablets
        if (isTablet) {
          document.documentElement.style.setProperty("--animation-duration", "0.5s");
        }

        // Enable full animations on desktop
        if (!isMobile && !isTablet && !prefersReducedMotion) {
          document.documentElement.style.setProperty("--animation-duration", "0.8s");
        }
      }
    };

    // Apply optimizations immediately and on DOM ready
    disableWalletInjection();
    optimizeForDevice();

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => {
        disableWalletInjection();
        optimizeForDevice();
      });
      return () => {
        document.removeEventListener("DOMContentLoaded", disableWalletInjection);
        document.removeEventListener("DOMContentLoaded", optimizeForDevice);
      };
    }
    // Always return a cleanup function
    return () => {};
  }, [isMobile, isTablet, prefersReducedMotion]);

  return <>{children}</>;
}

// Enhanced responsive loading component
function ResponsiveLoadingFallback() {
  const { isMobile, isTablet, prefersReducedMotion } = useViewport();

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <ResponsiveContainer className="text-center">
        <div className="relative">
          {/* Main loading spinner - responsive size */}
          <div
            className={`
              ${isMobile ? "w-12 h-12" : isTablet ? "w-14 h-14" : "w-16 h-16"} 
              border-4 border-emerald-500/20 border-t-emerald-500 rounded-full
              ${prefersReducedMotion ? "" : "animate-spin"}
            `}
          />

          {/* Background glow effect - only on desktop */}
          {!isMobile && !prefersReducedMotion && (
            <div
              className={`
                absolute inset-0 
                ${isTablet ? "w-14 h-14" : "w-16 h-16"} 
                border-4 border-emerald-500/10 rounded-full animate-pulse
              `}
            />
          )}

          {/* Loading text - responsive sizing */}
          <div
            className={`
              absolute top-20 left-1/2 transform -translate-x-1/2 text-emerald-400 font-medium
              ${isMobile ? "text-sm" : isTablet ? "text-base" : "text-lg"}
              ${prefersReducedMotion ? "" : "animate-pulse"}
            `}
          >
            Loading...
          </div>
        </div>
      </ResponsiveContainer>
    </div>
  );
}

// Enhanced responsive error fallback component
function ResponsiveErrorFallback({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) {
  const { isMobile, isTablet, breakpoint } = useViewport();

  useEffect(() => {
    // Log error for monitoring (replace with your error tracking service)
    console.error("Application Error:", {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      device: { isMobile, isTablet, breakpoint },
    });
  }, [error, isMobile, isTablet, breakpoint]);

  const isDevelopment = process.env.NODE_ENV === "development";

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <ResponsiveContainer maxWidth={isMobile ? "sm" : "md"} className="text-center">
        <div className="mb-8">
          {/* Error icon with responsive sizing */}
          <div
            className={`
              ${isMobile ? "w-16 h-16" : isTablet ? "w-18 h-18" : "w-20 h-20"} 
              mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center animate-pulse
            `}
          >
            <svg
              className={`${isMobile ? "w-8 h-8" : "w-10 h-10"} text-red-400`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>

          <h1
            className={`${
              isMobile ? "text-xl" : isTablet ? "text-2xl" : "text-2xl"
            } font-bold text-white mb-3`}
          >
            Oeps, er ging iets mis!
          </h1>

          <p
            className={`text-gray-400 mb-8 leading-relaxed ${
              isMobile ? "text-sm" : "text-base"
            }`}
          >
            Er is een onverwachte fout opgetreden. Dit kan komen door browser
            extensies of een tijdelijke storing. Probeer de pagina opnieuw te laden.
          </p>

          <div className="space-y-3">
            <button
              onClick={resetErrorBoundary}
              className={`
                w-full px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium 
                transition-all duration-200 transform hover:scale-105 
                focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900
                ${isMobile ? "text-sm" : "text-base"}
              `}
            >
              Probeer opnieuw
            </button>

            <button
              onClick={() => (window.location.href = "/")}
              className={`
                w-full px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium 
                transition-all duration-200 
                focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-900
                ${isMobile ? "text-sm" : "text-base"}
              `}
            >
              Ga naar homepage
            </button>
          </div>
        </div>

        {/* Development error details - responsive sizing */}
        {isDevelopment && (
          <details className="text-left mt-8 p-4 bg-slate-800 rounded-lg border border-slate-700">
            <summary
              className={`text-red-400 cursor-pointer mb-3 font-medium select-none ${
                isMobile ? "text-sm" : "text-base"
              }`}
            >
              🔧 Error Details (Development Mode)
            </summary>
            <div className="space-y-2">
              <div className="text-sm">
                <span className="text-gray-400">Message:</span>
                <pre
                  className={`text-red-300 mt-1 bg-slate-900 p-2 rounded overflow-auto ${
                    isMobile ? "text-xs" : "text-sm"
                  }`}
                >
                  {error.message}
                </pre>
              </div>
              <div className="text-sm">
                <span className="text-gray-400">Stack:</span>
                <pre
                  className={`text-gray-300 mt-1 bg-slate-900 p-2 rounded overflow-auto max-h-40 ${
                    isMobile ? "text-xs" : "text-sm"
                  }`}
                >
                  {error.stack}
                </pre>
              </div>
              <div className="text-sm">
                <span className="text-gray-400">Device Info:</span>
                <pre
                  className={`text-gray-300 mt-1 bg-slate-900 p-2 rounded overflow-auto ${
                    isMobile ? "text-xs" : "text-sm"
                  }`}
                >
                  {JSON.stringify({ isMobile, isTablet, breakpoint }, null, 2)}
                </pre>
              </div>
            </div>
          </details>
        )}
      </ResponsiveContainer>
    </div>
  );
}

// Main App component with responsive system integration
function App() {
  return (
    <PerformanceMonitor>
      <ErrorBoundary
        FallbackComponent={ResponsiveErrorFallback}
        onError={(error, errorInfo) => {
          // Enhanced error logging with device context
          console.error("ErrorBoundary caught error:", error, errorInfo);
        }}
        onReset={() => {
          // Optionally reset app state or reload
          window.location.reload();
        }}
      >
        <React.Suspense fallback={<ResponsiveLoadingFallback />}>
          <HomePage />
        </React.Suspense>
      </ErrorBoundary>
    </PerformanceMonitor>
  );
}

export default App;