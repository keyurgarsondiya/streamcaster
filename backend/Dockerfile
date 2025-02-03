# ==========================
# Step 1: Build Stage
# ==========================
FROM node:18 AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies (including devDependencies)
RUN npm install

# Copy the rest of the app source code
COPY . .

# Compile TypeScript
RUN npm run build

# ==========================
# Step 2: Production Image
# ==========================
FROM node:18 AS production

# Install FFmpeg again (if needed in production)
RUN apt-get update && apt-get install -y ffmpeg

# Set working directory
WORKDIR /app

# Copy only necessary files from build stage
COPY --from=build /app/package.json /app/package-lock.json ./
COPY --from=build /app/dist ./dist

# Install only production dependencies
RUN npm install --only=production

# Expose application port
EXPOSE 5000

# Start the server
CMD ["npm", "start"]
