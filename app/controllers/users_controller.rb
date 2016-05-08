class UsersController < ApplicationController
  autocomplete :user, :full_name, :full => true, :extra_data => [:id, :avatar, :first_name, :last_name]

  def index
    unless params[:user].blank?
      redirect_to user_path(params[:user][:id])
    end
    @users = User.where(pcc: current_user).order(last_name: :asc)
  end

  def show
    @user = User.find(params[:id])
  end

  def autocomplete_user_full_name
    if params[:filters]
      charts =  params[:filters][:charts]
      charts.map!{|c| c.parameterize("_").classify} unless charts.empty?
      order_by = params[:filters][:order_by]
      age = params[:filters][:age]
      gender = params[:filters][:gender]
      if params[:filters][:my_patients] == "true"
        if !charts.empty?
          users = current_user.primary_care_team.patients.joins(:charts).where(charts: {type: charts}).group('users.id').order("#{order_by}" => :ASC).where("date_of_birth < ?", age.to_i.years.ago).where(gender: gender)
        else
          users = current_user.primary_care_team.patients.order("#{order_by}" => :ASC).where("date_of_birth < ?", age.to_i.years.ago).where(gender: gender)
        end
      else
        if !charts.empty?
          users = User.joins(:charts).where(charts: {type: charts}).group('users.id').order("#{order_by}" => :ASC).where("date_of_birth < ?", age.to_i.years.ago).where(gender: gender)
        else
          users = User.with_role(:patient).order("#{order_by}" => :ASC).where("date_of_birth < ?", age.to_i.years.ago).where(gender: gender)
        end
      end
      render :json => users.map { |user| {:id => user.id, :label => user.full_name, :value => user.full_name, avatar: user.avatar, :first_name => user.first_name, last_name: user.last_name} }
    else
      term = params[:term]
      users = User.full_name(params[:term]).limit(10).order(last_name: :ASC)
      render :json => users.map { |user| {:id => user.id, :label => user.full_name, :value => user.full_name, :first_name => user.first_name, last_name: user.last_name} }
    end
  end
end
