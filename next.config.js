/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'ekyerljzfokqimbabzxm.supabase.co',
      'firebasestorage.googleapis.com'
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
}

module.exports = nextConfig