/** @type {import('next').NextConfig} */
const nextConfig = {
  // 'standalone' reduz drasticamente o tamanho do deploy e elimina dependência de node_modules gigantes em produção
  output: 'standalone',
  
  // Hostinger Shared/Cloud Node.js não possui libs gráficas nativas (sharp/libc6) instaladas por padrão.
  // Desativar a otimização evita o erro 500 nas imagens.
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
      },
    ],
  },
  
  // Headers de segurança
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
        ],
      },
    ];
  },
};

export default nextConfig;