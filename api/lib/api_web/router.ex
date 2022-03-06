defmodule ApiWeb.Router do
  use ApiWeb, :router

  # Handles HTML requests.
  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_live_flash
    plug :put_root_layout, {ApiWeb.LayoutView, :root}
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  # Handles JSON requests.
  pipeline :api do
    plug :accepts, ["json"]
  end

  # Process default page requests.
  scope "/", ApiWeb do
    pipe_through :browser

    get "/", PageController, :index
    get "/hello/:data", HelloController, :message
  end

  # Process API calls.
  scope "/api", ApiWeb do
    pipe_through :api
  end
end
