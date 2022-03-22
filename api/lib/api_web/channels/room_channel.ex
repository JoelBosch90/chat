defmodule ApiWeb.RoomChannel do
  use Phoenix.Channel

  # Allow users to join any room.
  def join("room:" <> _room_name, _message, socket) do
    {:ok, socket}
  end

  # Handle new chat messages sent by users.
  def handle_in("new_message", %{"message" => message}, socket) do

    # Broadcast each chat message to all users.
    broadcast!(socket, "message", %{message: message})

    # We don't expect a reply to this broadcast.
    {:noreply, socket}
  end

end
