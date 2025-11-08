/// <reference types="vite/client" />

declare global {
  interface Window {
    google?: any;
    initAutocomplete?: () => void;
    initMap?: () => void;
  }
}

export {};
