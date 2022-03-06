defmodule ApiWeb.HelloController do
  use ApiWeb, :controller

  def message(conn, %{"data" => data}) do
    render(conn, "hello.html", data: data)
  end
end
