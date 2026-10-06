import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // En-tetes de securite (NF, ajoutes par scripts/fix-security-headers.mjs).
  // La CSP est en mode RAPPORT SEULEMENT : elle observe sans bloquer, le temps de
  // verifier qu'aucune ressource legitime n'est refusee. La faire passer en mode
  // bloquant demande de relire les rapports, pas de changer ce bloc a l'aveugle.
  async headers() {
    const cspReportOnly = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data:",
      "connect-src 'self' https: wss:",
      "media-src 'self' blob: https:",
      "frame-src 'self' https:",
      "worker-src 'self' blob:",
      "manifest-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self'",
    ].join("; ");
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Permissions-Policy",
            value: "camera=(self), microphone=(self), geolocation=(self), payment=(self)",
          },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Content-Security-Policy-Report-Only", value: cspReportOnly },
        ],
      },
    ];
  },

  agentRules: false,
  experimental: {
    optimizePackageImports: ["lucide-react", "date-fns"],
    staleTimes: { dynamic: 30, static: 180 },
  },
};

export default nextConfig;
