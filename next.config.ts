import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
<<<<<<< HEAD
    domains: [
      'hagzzstorage.blob.core.windows.net',
      'ekyerljzfokqimbabzxm.supabase.co'
    ],
=======
    domains: ['hagzzstorage.blob.core.windows.net'],
>>>>>>> bca22f5650d9d75baeb93f1e7ba3fc2055bf8bd6
  },
  env: {
    AZURE_STORAGE_ACCOUNT_NAME: process.env.AZURE_STORAGE_ACCOUNT_NAME,
    AZURE_STORAGE_SAS_TOKEN: process.env.AZURE_STORAGE_SAS_TOKEN,
    AZURE_STORAGE_CONTAINER_NAME: process.env.AZURE_STORAGE_CONTAINER_NAME,
  },
  eslint: {
    ignoreDuringBuilds: true, // ✅ تعطيل ESLint أثناء البناء
  },
  typescript: {
    ignoreBuildErrors: true, // ✅ تعطيل فحص TypeScript أثناء البناء
  },
};

export default nextConfig;
