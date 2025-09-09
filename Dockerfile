# --- Stage 1: The Builder ---
# This stage installs all dependencies and builds the application.
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install ALL dependencies, including devDependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN npm run build


# --- Stage 2: The Runner ---
# This stage creates the final, lean production image.
FROM node:18-alpine AS runner

WORKDIR /app

# We need to set the NODE_ENV to production for Next.js to run correctly
ENV NODE_ENV=production

# Copy the standalone Next.js server output from the 'builder' stage
# This is an optimized server for production.
# The folder structure inside .next/standalone is automatically created by Next.js
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# You may need to create a non-root user for security best practices
# For simplicity, we'll skip this, but in a real production app, you would add:
# USER nextjs

EXPOSE 3000

# The command to start the optimized production server
CMD ["node", "server.js"]