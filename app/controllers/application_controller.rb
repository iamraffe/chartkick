class ApplicationController < ActionController::Base
  # include SessionParser
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  before_action :get_widget_information

  private
    def get_widget_information
      @notifications = Notification.where(receiver_id: current_user.id).order(created_at: :desc).limit(10)
      @messages = []
      # @patients = current_user.primary_care_team.patients.order(last_name: :ASC)
      @patients = User.with_role(:patient).order(last_name: :ASC)
      # @notifications = Notification.where(receiver_id: current_user.id).order(created_at: :desc).unread_by(current_user)
    end
end
