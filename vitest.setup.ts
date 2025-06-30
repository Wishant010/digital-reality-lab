import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeAll, vi } from 'vitest';

// Cleanup after each test case
afterEach(() => {
  cleanup();
});

// Mock window.matchMedia for responsive tests
beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // deprecated
      removeListener: vi.fn(), // deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

  // Mock ResizeObserver
  global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));

  // Mock IntersectionObserver
  global.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));

  // Mock requestAnimationFrame (fix type error)
  global.requestAnimationFrame = vi.fn((cb: FrameRequestCallback): number => setTimeout(cb, 16) as unknown as number);
  global.cancelAnimationFrame = vi.fn((id: number) => clearTimeout(id));

  // Mock performance API
  Object.defineProperty(window, 'performance', {
    writable: true,
    value: {
      now: vi.fn(() => Date.now()),
      mark: vi.fn(),
      measure: vi.fn(),
      getEntriesByType: vi.fn(() => []),
      getEntriesByName: vi.fn(() => []),
    },
  });

  // Mock devicePixelRatio
  Object.defineProperty(window, 'devicePixelRatio', {
    writable: true,
    value: 1,
  });

  // Mock navigator.connection
  Object.defineProperty(navigator, 'connection', {
    writable: true,
    value: {
      effectiveType: '4g',
      downlink: 10,
      rtt: 100,
    },
  });

  // Mock touch capabilities
  Object.defineProperty(window, 'ontouchstart', {
    writable: true,
    value: undefined,
  });

  Object.defineProperty(navigator, 'maxTouchPoints', {
    writable: true,
    value: 0,
  });
});