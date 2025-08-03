FROM node:23 as BUILD_IMAGE
WORKDIR /app
COPY package.json ./
# install dependencies
COPY . .
RUN yarn install --frozen-lockfile
ENV NODE_OPTIONS="--max-old-space-size=4096"
# build
RUN yarn build:dev
# remove dev dependencies
##RUN npm prune --production
FROM node:alpine
WORKDIR /app

# Install PM2 globally
# RUN npm install -g pm2
# Install dependencies
COPY package.json yarn.lock ./

RUN yarn install

# Copy semua file proyek ke dalam container
COPY . .

# Expose port yang digunakan Vite (default 5173)
# copy from build image
#COPY --from=BUILD_IMAGE /app/package.json ./package.json
#COPY --from=BUILD_IMAGE /app/node_modules ./node_modules
#$COPY --from=BUILD_IMAGE /app/.next ./.next
#COPY --from=BUILD_IMAGE /app/public ./public
EXPOSE 3000

# Use PM2 to start the application
#CMD ["pm2-runtime", "server.js"]
CMD ["yarn","dev"]

