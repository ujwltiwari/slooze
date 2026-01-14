FROM node:18-alpine

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

# Install dependencies checking specifically for common build issues
# Using --frozen-lockfile to ensure reproducible builds
RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm build

EXPOSE 3001

CMD ["pnpm", "start", "-p", "3001"]
