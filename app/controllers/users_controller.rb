class UsersController < ApplicationController
  autocomplete :user, :name, :full => true, :extra_data => [:id]

  def index
    if params[:user][:id].blank?
    else
      redirect_to user_path(params[:user][:id])
    end
  end

  def show
    @user = User.find(params[:id])
  end
end
