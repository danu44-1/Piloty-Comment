# syntax=docker/dockerfile:1
# Dockerfile Multi-Stage Build & Hardening Non-Root User
# Rujukan: CIS Docker Benchmark, NIST SP 800-190, Slide Pekan 06 KKS CS5-2026
# Mitigasi: T-03 (Elevation of Privilege) & T-07 (Secrets Leakage)

# ==============================================================================
# Tahap 1: Dependencies (deps)
# Menginstal dependensi produksi persis dari lockfile tanpa menjalankan skrip tak tepercaya
# ==============================================================================
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# ==============================================================================
# Tahap 2: Builder
# Mengompilasi aplikasi Next.js ke mode standalone bundle
# ==============================================================================
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client and compile Next.js standalone
ENV NEXT_TELEMETRY_DISABLED=1
RUN npx prisma generate
RUN npm run build

# ==============================================================================
# Tahap 3: Runner (Image Akhir Produksi Minimal)
# Hanya memuat artefak yang diperlukan, berjalan sebagai user non-root UID 1001
# ==============================================================================
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NEXT_TELEMETRY_DISABLED=1

# Buat grup dan pengguna non-root ber-UID 1001 (bukan root UID 0)
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# Salin aset publik dan berkas hasil build standalone dengan kepemilikan non-root
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Beralih ke pengguna non-root
USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
