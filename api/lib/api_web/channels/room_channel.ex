defmodule ApiWeb.RoomChannel do
  use Phoenix.Channel

  # Allow users to join the lobby room.
  def join("room:lobby", _message, socket) do
    {:ok, socket}
  end

  #
  def handle_chat("send_chat", %{"message" => message}, socket) do
    broadcast socket, "receive_chat", %{message: message}
    {:noreply, socket}
  end

end
