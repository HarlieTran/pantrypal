import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Setting the third parameter to '' loads all variables regardless of prefix.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    define: {
      // This tells Vite to replace 'process.env.ONBOARDING_API_URL' 
      // with the actual value during the build process.
      'process.env.ONBOARDING_API_URL': JSON.stringify(env.ONBOARDING_API_URL)
    }
  };
});