/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },   // fotos enviadas via Supabase Storage
      { protocol: 'https', hostname: 'picsum.photos' },    // só os produtos de exemplo do schema.sql
    ],
  },
};

export default nextConfig;
