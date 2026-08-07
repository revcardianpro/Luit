import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Default is 1MB, too small for a typical phone-camera photo
      // uploaded as an avatar via the /account Server Action.
      bodySizeLimit: "5mb",
    },
  },
};

export default nextConfig;
