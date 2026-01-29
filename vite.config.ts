
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // تم التعديل ليطابق رابط المستودع الخاص بك: Gold-calculator
  base: '/Gold-calculator/',
});
