import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY': JSON.stringify(
        process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || 'pk_live_60d89b07b32902dcabf51dfc064aa4af9db102a3'
      ),
      'process.env.VITE_PAYSTACK_PUBLIC_KEY': JSON.stringify(
        process.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_live_60d89b07b32902dcabf51dfc064aa4af9db102a3'
      ),
    },
    resolve: {
      alias: {
        '@': path.resolve('.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
