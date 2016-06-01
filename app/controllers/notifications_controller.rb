class NotificationsController < ApplicationController
  def mark_as_read
    @notification = Notification.find(params[:id])
    @notification.mark_as_read! :for => current_user
    render json: {message: "OK"}
  end

  def mark_all_as_read
    # @notification = Notification.find(params[:id])
    Notification.mark_as_read! :all, :for => current_user
    render json: {message: "OK"}
  end

  def index
    @notifications = Notification.where(receiver_id: current_user.id).order(created_at: :desc).limit(10)
    render json: @notifications.unread_by(current_user)
  end
end
