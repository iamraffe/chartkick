class PagesController < ApplicationController
  before_action :authenticate_user!

  def dashboard
    @patients = User.where(pcc: current_user).order(last_name: :asc)
  end
end
