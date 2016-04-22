class UsersController < ApplicationController
  autocomplete :user, :full_name, :full => true, :extra_data => [:id]

  def index
    unless params[:user].blank?
      redirect_to user_path(params[:user][:id])
    end
    @users = User.where(pcc: current_user).order(last_name: :asc)
  end

  def show
    @user = User.find(params[:id])
  end

  def get_autocomplete_items(parameters)
    # byebug
    # items = active_record_get_autocomplete_items(parameters)
    # items = items.where(searchable: true)
    # byebug
    query = parameters[:term]
    items = User.full_name(query).limit(10).order(last_name: :ASC)
  end
end
