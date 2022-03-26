# Get a light NodeJS base image.
FROM node:alpine

# Create the working directory and give ownership to the node user.
RUN mkdir -p /client && chown -R node:node /client

# Use the new working directory.
WORKDIR /client

# After building, we can switch to production mode.
ENV NODE_ENV production

# Copy over all package manager files.
COPY --chown=node:node package*.json ./

# Use the node user to run the install commands.
USER node

# Install only the libraries that we need for production.
RUN npm ci --only=production

# Copy the application files to the directory.
COPY --chown=node:node . .

# Make sure we optimize for production.
RUN npm run build

# Start the client server in production mode.
CMD ["npm", "run", "start"]