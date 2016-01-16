class CholesterolsController < ApplicationController
  # before_action :create_entries, only: [:create]
  def new
    session[:chart_params] ||= {}
    session[:entry_params] ||= {}
    session[:intervention_params] ||= {}
    @chart = Cholesterol.new(session[:chart_params])
    @chart.current_step = session[:chart_step] unless session[:chart_step].nil?
    # byebug
  end

  def create
    session[:chart_params].deep_merge!(chart_params) if chart_params
    session[:entry_params].deep_merge!(entry_params) if entry_params
    # byebug
    @chart = Cholesterol.new(session[:chart_params])
    @chart.current_step = session[:chart_step] unless session[:chart_step].nil?
    if @chart.valid?
      if params[:back_button]
        @chart.previous_step
      elsif @chart.last_step?
        @chart.save if @chart.all_valid?
        Entry.create_and_link(@chart, session[:entry_params], session[:intervention_params])
      else
        @chart.next_step
      end
      session[:chart_step] = @chart.current_step
    end
    if @chart.new_record?
      render "new"
    else
      session[:chart_step] = session[:chart_params] = session[:entry_params] = session[:intervention_params] = nil
      flash[:notice] = "chart saved!"
      redirect_to @chart, format: 'pdf'
    end
  end

  def show
    @chart = Cholesterol.find params[:id]
    all_entries = @chart.entries.map do |entry|
      {
        date: entry.date.strftime("%b %Y").to_s,
        value: entry.value,
        symbol: entry.symbol
      }
    end
    all_interventions = @chart.interventions.map do |intervention|
      {
        start: intervention.start.strftime("%Y-%m-%d").to_s,
        end: intervention.end.strftime("%Y-%m-%d").to_s,
        title: intervention.title,
        dose: intervention.dose
      }
    end
    # byebug
    respond_to do |format|
      format.html
      format.json {render json: {entries: all_entries, interventions: all_interventions}}
      format.pdf do
        render pdf: "show", layout: 'pdf.html.erb'   # Excluding ".pdf" extension.
      end
    end
  end

  def cholesterol_session
    entry_params = Array.new
    session[:entry_params]["date"].each do |i,v|
      ldl = {symbol: "LDL", date: v.to_time.strftime("%b %Y"),value: session[:entry_params]["ldl"]["#{i}"].to_i}
      hdl = {symbol: "HDL", date: v.to_time.strftime("%b %Y"), value: session[:entry_params]["hdl"]["#{i}"].to_i}
      triglycerides = {symbol: "TRIGLYCERIDES", date: v.to_time.strftime("%b %Y"), value: session[:entry_params]["triglycerides"]["#{i}"].to_i}
      cholesterol = {symbol: "CHOLESTEROL", date: v.to_time.strftime("%b %Y"), value: session[:entry_params]["cholesterol"]["#{i}"].to_i}
      entry_params.push(ldl,hdl, triglycerides, cholesterol)
    end
    intervention = session[:intervention_params]
    render json: {entries: entry_params, intervention: intervention}
  end

  def intervention_session
    # byebug
    session[:intervention_params].deep_merge!(intervention_params) if intervention_params
    render json: {message: "ok"}
  end

  private
    def chart_params
      params[:cholesterol].permit! if params[:cholesterol]
    end

    def entry_params
      params[:entry].permit! if params[:entry]
    end

    def intervention_params
      params[:intervention].permit! if params[:intervention]
    end
end
