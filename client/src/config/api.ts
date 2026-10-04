/**
 * HealthPulse Frontend API Configuration
 * Supports local proxy in development and configured production backend on Render/Cloud.
 */
export const API_BASE_URL: string = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');
