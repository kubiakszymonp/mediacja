# Etap budowania
FROM node:18-alpine AS builder

WORKDIR /app

# Argumenty budowania
ARG NEXT_PUBLIC_OPENAI_API_KEY
ARG NEXT_PUBLIC_APP_PASSWORD
ARG PORT=3001

# Kopiowanie plików package.json i package-lock.json
COPY package*.json ./
COPY yarn.lock ./

# Instalacja zależności
RUN yarn install --frozen-lockfile

# Kopiowanie reszty plików
COPY . .

# Budowanie aplikacji
RUN yarn build

# Etap produkcyjny
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV production
ENV NEXT_PUBLIC_OPENAI_API_KEY=${NEXT_PUBLIC_OPENAI_API_KEY}
ENV NEXT_PUBLIC_APP_PASSWORD=${NEXT_PUBLIC_APP_PASSWORD}
ENV PORT=3001

# Kopiowanie tylko potrzebnych plików z etapu budowania
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Ustawienie portu
EXPOSE 3001

# Uruchomienie aplikacji
CMD ["node", "server.js"] 