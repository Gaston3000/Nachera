/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Si el asset final del rostro se sirve desde un CDN externo,
    // agregar el dominio acá (ej. Cloudinary, S3, etc.).
    remotePatterns: [],
  },
};

export default nextConfig;
