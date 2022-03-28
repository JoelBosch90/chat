# Load up a lightweight Elixir image.
FROM elixir:alpine

# Create the working directory.
WORKDIR /api

# Copy the package files that contain our dependencies.
COPY mix.exs mix.lock ./

# Install our package manager.
RUN mix local.rebar --force && mix local.hex --force

# Install inotify for hot reloading.
RUN apk update && apk add inotify-tools

# Install dependencies.
RUN mix deps.get

# Copy all files.
COPY . ./

# Run the server.
CMD ["mix", "phx.server"]