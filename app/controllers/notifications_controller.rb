class NotificationsController < ApplicationController
  def mark_as_read
    @n = Notification.find(params[:id])
    @n.mark_as_read! :for => User.find_by(id: 301)
    render json: {message: "OK"}
  end
end
