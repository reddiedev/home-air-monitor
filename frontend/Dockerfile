# Use Node.js LTS version with pnpm
FROM node:18-alpine as base

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile --prod

# Copy source code
COPY . .

# Build stage
FROM base as build
RUN pnpm install --frozen-lockfile
RUN pnpm run build

# Production stage
FROM node:18-alpine as production

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy built application and package files
COPY --from=build /app/.output ./.output
COPY --from=build /app/package.json ./
COPY --from=build /app/pnpm-lock.yaml ./

# Install only production dependencies
RUN pnpm install --frozen-lockfile --prod

# Expose port
EXPOSE 3000

# Start the application
CMD ["pnpm", "start"]