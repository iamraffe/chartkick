class UsersController < ApplicationController
  autocomplete :user, :name, :full => true, :extra_data => [:id]

  def index
    unless params[:user][:id].blank?
      redirect_to user_path(params[:user][:id])
    end
  end

  def show
    @user = User.find(params[:id])
  end
end
