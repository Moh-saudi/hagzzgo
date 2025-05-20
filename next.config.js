/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: true,
        serverComponentsExternalPackages: ['@supabase/auth-helpers-nextjs', '@supabase/supabase-js'],
    },
  images: {
    domains: [
      'ekyerljzfokqimbabzxm.supabase.co',
      'firebasestorage.googleapis.com',
      'localhost',
      process.env.NEXT_PUBLIC_SUPABASE_URL?.replace('https://', '') || '',
    ],
  },
  env: {
    AZURE_STORAGE_ACCOUNT_NAME: process.env.AZURE_STORAGE_ACCOUNT_NAME || '',
    AZURE_STORAGE_SAS_TOKEN: process.env.AZURE_STORAGE_SAS_TOKEN || '',
    AZURE_STORAGE_CONTAINER_NAME: process.env.AZURE_STORAGE_CONTAINER_NAME || '',
  },
  // Add other configurations here
  reactStrictMode: true,
  swcMinify: true,
  optimizeFonts: false,
  experimental: {
    appDir: true
  }
}

module.exports = nextConfig;
// This configuration file sets up Next.js with experimental features, image domains, environment variables for Azure storage, and other optimizations.
// It also enables React's strict mode and SWC minification for better performance.