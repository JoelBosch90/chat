# Get a light NodeJS base image.
FROM node:alpine as build

# Create the working directory and give ownership to the node user.
RUN mkdir -p /client && chown -R node:node /client

# Use the new working directory.
WORKDIR /client

# Copy over all package manager files.
COPY --chown=node:node package*.json ./

# Use the node user to run the install commands.
USER node

# Copy the package files that contain our dependencies.
COPY package*.json .

# Copy the application files to the directory.
COPY --chown=node:node . .

# Make sure we optimize for production.
RUN npm run build

# Use our build phase to host the live environment.
FROM build as release

# After building, we can switch to production mode.
ENV NODE_ENV production

# Use the node user to run the install commands.
USER node

# Install only the libraries that we need for production.
RUN npm ci --only=production

# Start the client server in production mode.
CMD ["npm", "run", "start"]