defmodule ApiWeb.RoomChannel do
  use Phoenix.Channel
  alias ApiWeb.Presence

  # Allow users to join any room.
  def join("room:" <> _room_name, _message, socket) do

    # Handle the after_join events.
    send(self(), :after_join)

    # Reply with the current id to the user.
    {:ok, %{ sender_id: socket.assigns.sender_id }, socket}
  end

  # Handle new chat messages sent by users.
  def handle_in("new_message", %{"text" => text, "sender_name" => sender_name}, socket) do

    # Get the current date and time.
    now = DateTime.utc_now

    # Get a unique ID for the current runtime instance.
    runtimeId = System.unique_integer([:positive])

    # Broadcast each chat message to all users.
    broadcast!(socket, "message", %{
      text: text,
      time: now,
      sender_name: sender_name,

      # Add the user's assigned id.
      sender_id: socket.assigns.sender_id,

      # Simply combining the timestamp with the unique runtime ID should always
      # give us a unique message ID.
      id: "#{now}.#{runtimeId}"
    })

    # We don't expect a reply to this broadcast.
    {:noreply, socket}
  end

  # Handle additional information events.
  def handle_info(:after_join, socket) do

    # We use the Phoenix Presence object to inform about channel information
    # events, so we should use it to track
    {:ok, _} = Presence.track(socket, "#{socket.assigns.sender_id}", %{
      online_at: DateTime.utc_now,
    })

    # Send the Presence list to the client in a 'presence_state' event.
    push(socket, "presence_state", Presence.list(socket))
    {:noreply, socket}
  end

end
