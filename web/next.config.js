import withPWA from "next-pwa";

const isDev = process.env.NODE_ENV === "development";

const nextConfig = withPWA({
  dest: "public",
  disable: isDev,

  register: true,
  skipWaiting: true, //  AUTO UPDATE SERVICE WORKER

  runtimeCaching: [
    {
      urlPattern: /^https:\/\/api-alam\.vercel\.app\/.*/i,
      handler: "NetworkOnly", //  API selalu fresh
    },
  ],
});

export default nextConfig;
