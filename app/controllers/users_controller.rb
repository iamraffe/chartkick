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

  # def get_autocomplete_items(parameters)
  #   byebug
  #   if parameters[:filters]
  #     byebug
  #   else
  #     items = User.full_name(parameters[:term]).limit(10).order(last_name: :ASC)
  #   end
  # end

  def autocomplete_user_full_name
    # byebug
    if params[:filters]
      # byebug
      charts =  params[:filters][:charts]
      order_by = params[:filters][:order_by]
      # users = User.where(id: Chart.select(:user_id).group(:user_id).where(type: charts).having("count(type) = ?", charts.size))

      # byebug
      if !charts.empty?
        users = User.joins(:charts).where(charts: {type: charts}).group('users.id').order("#{order_by}" => :ASC)
      else
        users = User.with_role(:patient).order("#{order_by}" => :ASC)
      end
      # byebug
      render :json => users.map { |user| {:id => user.id, :label => user.full_name, :value => user.full_name, avatar: user.avatar, :first_name => user.first_name, last_name: user.last_name} }
    else
      # super
      term = params[:term]
      users = User.full_name(params[:term]).limit(10).order(last_name: :ASC)
      render :json => users.map { |user| {:id => user.id, :label => user.full_name, :value => user.full_name, :first_name => user.first_name, last_name: user.last_name} }
    end
    # term = params[:term]
    # brand_id = params[:brand_id]
    # country = params[:country]
    # products = Product.where('brand = ? AND country = ? AND name LIKE ?', brand_id, country, "%#{term}%").order(:name).all
    # render :json => products.map { |product| {:id => product.id, :label => product.name, :value => product.name} }
  end
end
