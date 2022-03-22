defmodule ApiWeb.RoomChannel do
  use Phoenix.Channel

  # Allow users to join any room.
  def join("room:" <> _room_name, _message, socket) do
    {:ok, socket}
  end

  # Handle new chat messages sent by users.
  def handle_in("new_message", %{"message" => message}, socket) do

    # Get the current date and time.
    now = DateTime.utc_now

    # Get a unique ID for the current runtime instance.
    runtimeId = System.unique_integer([:positive])

    # Broadcast each chat message to all users.
    broadcast!(socket, "message", %{
      message: message,
      time: now,

      # Simply combining the timestamp with the unique runtime ID should always
      # give us a unique message ID.
      id: "#{now}.#{runtimeId}"
    })

    # We don't expect a reply to this broadcast.
    {:noreply, socket}
  end

end
