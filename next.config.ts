import type { NextConfig } from "next";

// Derived from the existing env var rather than hardcoded, so this
// keeps working automatically if the Supabase project ever changes.
const supabaseHostname = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : undefined;

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Default is 1MB, too small for a typical phone-camera photo
      // uploaded as an avatar or marketplace listing photo.
      bodySizeLimit: "5mb",
    },
  },
  images: {
    // Lets next/image optimize images served from Supabase Storage
    // (avatars, listing photos) -- without this, next/image refuses to
    // render any external host it doesn't explicitly recognize.
    remotePatterns: supabaseHostname
      ? [
          {
            protocol: "https",
            hostname: supabaseHostname,
            pathname: "/storage/v1/object/public/**",
          },
        ]
      : [],
  },
};

export default nextConfig;
