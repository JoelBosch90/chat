# Get a light NodeJS base image.
FROM node:17-alpine as build

# Create the working directory and give ownership to the node user.
RUN mkdir -p /client && chown -R node:node /client

# Use the new working directory.
WORKDIR /client

# Copy over all package manager files.
COPY --chown=node:node package*.json ./

# Use the node user to run the install commands.
USER node

# Install only the libraries that we need for production.
RUN npm install

# We can switch to production mode.
ENV NODE_ENV production

# Copy the application files to the directory.
COPY --chown=node:node . .

# Make sure we optimize for production.
RUN npm run build

# Use Nginx to serve the production build.
FROM nginx:stable-alpine

# Copy the build to Nginx.
COPY --from=build /client/build /usr/share/nginx/html

# Copy over our Nginx configuration.
COPY ./nginx/nginx.conf /etc/nginx

# Run Nginx.
CMD ["nginx", "-g", "daemon off;"]