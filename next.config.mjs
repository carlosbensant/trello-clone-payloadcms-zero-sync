import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your Next.js config here
  reactStrictMode: false, // Disable to prevent double WebSocket connections in development
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
