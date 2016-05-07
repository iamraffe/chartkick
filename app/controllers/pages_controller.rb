class PagesController < ApplicationController
  before_action :authenticate_user!

  def dashboard
    SessionHelper.clean(session)
    @notifications = Notification.where(receiver_id: current_user.id).order(created_at: :desc).limit(10)
    @messages = []
    # @patients = current_user.primary_care_team.patients.order(last_name: :ASC)
    @patients = User.with_role(:patient).order(last_name: :ASC)
  end
end
