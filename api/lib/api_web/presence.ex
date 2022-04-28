defmodule ApiWeb.Presence do
  use Phoenix.Presence,
    otp_app: :api,
    pubsub_server: Api.PubSub

end
