import withPWA from "next-pwa";

const isDev = process.env.NODE_ENV === "development";

const nextConfig = withPWA({
  dest: "public",
  disable: isDev, // ❗ penting: aktif hanya saat build
});

export default nextConfig;
