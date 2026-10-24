# ---------- Production Dockerfile ----------
FROM node:20-alpine AS base

WORKDIR /app

# Install dependencies first (better layer caching)
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev || npm install --omit=dev

# Copy source code
COPY . .

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "server.js"]

# from node version container as name container
# spcific work on it path in linux project
# copy pack.json or requirements file to dir
# run command install depandceis as npm i or npm ci or pip install
# copy all node_module in it or all packages in project to folder
# create volume to check changes in production
# add env var 
# create expose port for this image (how listen for the image)
# cmd to create npm run or any command in terminal to work the project npm run or python3 run migration or python3 script.py
