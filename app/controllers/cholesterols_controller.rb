class CholesterolsController < ApplicationController
  # before_action :create_entries, only: [:create]
  def new
    session[:chart_params] ||= {}
    session[:entry_params] ||= {}
    @chart = Cholesterol.new(session[:chart_params])
    @chart.current_step = session[:chart_step] unless session[:chart_step].nil?
    # byebug
  end

  def create
    session[:chart_params].deep_merge!(chart_params) if chart_params
    session[:entry_params].deep_merge!(entry_params) if entry_params
    @chart = Cholesterol.new(session[:chart_params])
    @chart.current_step = session[:chart_step] unless session[:chart_step].nil?
    if @chart.valid?
      if params[:back_button]
        @chart.previous_step
      elsif @chart.last_step?
        @chart.save if @chart.all_valid?
        Entry.create_and_link(@chart, session[:entry_params])
      else
        @chart.next_step
      end
      session[:chart_step] = @chart.current_step
    end
    if @chart.new_record?
      render "new"
    else
      session[:chart_step] = session[:chart_params] = session[:entry_params] = nil
      flash[:notice] = "chart saved!"
      redirect_to @chart, format: 'pdf'
    end
  end

  def show
    @chart = Cholesterol.find params[:id]
    respond_to do |format|
      format.html
      format.pdf do
        render pdf: "show", layout: 'pdf.html.erb'   # Excluding ".pdf" extension.
      end
    end
  end

  private
    def chart_params
      params[:cholesterol].permit! if params[:cholesterol]
    end

    def entry_params
      params[:entry].permit! if params[:entry]
    end
end
