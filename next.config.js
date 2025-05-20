/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverComponentsExternalPackages: ['@supabase/ssr', '@supabase/supabase-js'],
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
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    },
    reactStrictMode: true,
    swcMinify: true,
    optimizeFonts: false
}

module.exports = nextConfig