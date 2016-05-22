class ChartsController < ApplicationController

  def new
    session[:chart_params] ||= {}
    session[:entry_params] ||= {}
    session[:intervention_params] ||= []
    @chart = Chart.new(session[:chart_params].deep_merge!(chart_params))
    if (session[:chart_step] == "naming" || @chart.current_step == "naming") && !@chart.user_id.nil?
      @chart.current_step = session[:chart_step] = "adding"
      @entries = Entry.build(session[:chart_params]["user_id"], session[:chart_params]["type"])
    else
      @chart.current_step = session[:chart_step] unless session[:chart_step].nil?
    end
  end

  def create
    session[:chart_params].deep_merge!(chart_params) if chart_params
    session[:entry_params].deep_merge!(entry_params) if entry_params
    @chart = Chart.where(user_id: params[:chart][:user_id].to_i).where(type: params[:chart][:type]).first if chart_params
    if @chart.nil?
      @chart = Chart.new(session[:chart_params])
    else
      redirect_to edit_chart_path(@chart) and return
    end
    @chart.current_step = session[:chart_step] unless session[:chart_step].nil?
    if @chart.valid?
      if params[:back_button]
        @chart.previous_step
      elsif @chart.last_step?
        @chart.save if @chart.all_valid?
        @chart.update_attributes(approved: true) if current_user.has_role?(:doctor)
        Entry.create_and_link(@chart, session[:entry_params])
        Intervention.create_and_link(@chart, session[:intervention_params])
        @chart.send_notice_from(current_user)
      else
        @chart.next_step
      end
      session[:chart_step] = @chart.current_step
    end
    # byebug
    if @chart.new_record?
      @entries = Entry.build(session[:chart_params]["user_id"], session[:chart_params]["type"])
      render "new"
    else
      session[:chart_step] = session[:chart_params] = session[:entry_params] = session[:intervention_params] = nil
      flash[:notice] = "chart saved!"
      redirect_to chart_path(@chart)
    end
  end

  def show
    @chart =  Chart.find(params[:id])
    @entries = Entry.build(@chart.user.id, @chart.type)
    session[:chart_params] ||= {}
    session[:entry_params] ||= {}
    session[:intervention_params] ||= []
    respond_to do |format|
      format.html
      format.json {render json: @chart.data}
    end
  end

  def edit
    session[:chart_params] ||= {}
    session[:entry_params] ||= {}
    session[:intervention_params] ||= []
    session[:chart_params].deep_merge!(chart_params) unless chart_params.nil?
    @chart = Chart.find(params[:id])
    @chart.toggle!(:opened)
    if (session[:chart_step] == "naming" || @chart.current_step == "naming") && !@chart.user_id.nil?
      @chart.current_step = session[:chart_step] = "adding"
      @entries = Entry.build(session[:chart_params]["user_id"], session[:chart_params]["type"])
    else
      @chart.current_step = session[:chart_step] unless session[:chart_step].nil?
    end
  end

  def update
    session[:chart_params].deep_merge!(chart_params) if chart_params
    session[:entry_params].deep_merge!(entry_params) if entry_params
    @chart = Chart.find(params[:id])
    @chart.current_step = session[:chart_step] unless session[:chart_step].nil?
    if @chart.valid?
      if params[:back_button]
        @chart.previous_step
      elsif @chart.last_step?
        # @chart.save if @chart.all_valid?
        # @chart.update_attributes(approved: true, updated_at: Time.now) if current_user.has_role?(:doctor)
        @chart.toggle!(:opened)
        Entry.create_and_link(@chart, session[:entry_params])
        Intervention.create_and_link(@chart, session[:intervention_params])
        @chart.send_notice_from(current_user)
      else
        @chart.next_step
      end
      session[:chart_step] = @chart.current_step
    end
    # byebug
    if @chart.opened
      @entries = Entry.build(session[:chart_params]["user_id"], session[:chart_params]["type"])
      render "edit"
    else
      session[:chart_step] = session[:chart_params] = session[:entry_params] = session[:intervention_params] = nil
      flash[:notice] = "chart saved!"
      redirect_to chart_path(@chart)
    end
    # @chart = Chart.find(params[:id])
    # session[:entry_params].deep_merge!(entry_params)
    # Entry.update_entries(entry_params)
    # respond_to do |format|
    #   format.js   {}
    #   format.json { render json:{ status: "ok"} }
    # end
  end

  def export
    png = Chart.export(params[:blob])
    render json: {png: png}
  end

  def chart_session
    @interventions = Intervention.where(user_id: session[:chart_params]["user_id"].to_i).where(chart_type: session[:chart_params]["type"]).map {|intervention| intervention.decode! }
    session[:intervention_params] = Intervention.to_session(@interventions, session) unless @interventions.nil?
    render json: SessionHelper.parse(session)
  end

  def update_entries_in_session
    session[:entry_params].each{|key, value| value.delete("#{params[:id].to_i+1}") }
    render json:{ status: "ok"}
  end

  def clean_session
    SessionHelper.clean(session)
    redirect_to root_path
  end

  def approve
    @chart = Chart.find(params[:id])
    Intervention.create_and_link(@chart, session[:intervention_params])
    @chart.approve!(current_user)
    redirect_to "/charts/#{@chart.id}"
  end

  private
    def chart_params
      params.require(:chart).permit(:user_id, :type, :user) if params[:chart]
    end

    def entry_params
      params[:entry].permit! if params[:entry]
    end

    def intervention_params
      params[:intervention].permit! if params[:intervention]
    end
end
