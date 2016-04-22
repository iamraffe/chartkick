class PagesController < ApplicationController
  before_action :authenticate_user!

  def dashboard
    @notifications = Notification.where(receiver_id: current_user.id).order(created_at: :desc).limit(10)
    @messages = []
    @patients = User.where(pcc: current_user).order(last_name: :asc)
  end
end
