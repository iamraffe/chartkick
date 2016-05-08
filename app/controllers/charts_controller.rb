class ChartsController < ApplicationController

  def new
    session[:chart_params] ||= {}
    session[:entry_params] ||= {}
    session[:intervention_params] ||= []
    @chart = Chart.new(session[:chart_params].deep_merge!(chart_params))
    # session[:chart_step] = "adding" unless @chart.user_id.nil?
    if (session[:chart_step] == "naming" || @chart.current_step == "naming") && !@chart.user_id.nil?
      # byebug
      @chart.current_step = session[:chart_step] = "adding"
      @entries = Entry.build(session[:chart_params]["user_id"], session[:chart_params]["type"])
    else
      @chart.current_step = session[:chart_step] unless session[:chart_step].nil?
    end
    # @chart.current_step = session[:chart_step] == "naming" session[:chart_step].nil?
    # @chart.current_step = @chart.previous_step
  end

  def create
    session[:chart_params].deep_merge!(chart_params) if chart_params
    session[:entry_params].deep_merge!(entry_params) if entry_params
    @chart = Chart.new(session[:chart_params])
    @chart.current_step = session[:chart_step] unless session[:chart_step].nil?
    # if (session[:chart_step] == "naming" || @chart.current_step == "naming") && !@chart.user_id.nil?
    #   byebug
    #   @chart.current_step = session[:chart_step] = "adding"
    # else
    #   @chart.current_step = session[:chart_step] unless session[:chart_step].nil?
    # end
    # @chart.current_step = session[:chart_step] unless session[:chart_step].nil?
    # byebug
    if @chart.valid?
      if params[:back_button]
        @chart.previous_step
      elsif @chart.last_step?
        @chart.save if @chart.all_valid?
        @chart.update_attributes(approved: true) if current_user.has_role?(:doctor)
        Entry.create_and_link(@chart, session[:entry_params])
        Intervention.create_and_link(@chart, session[:intervention_params])
        @chart.send_notice_from(current_user)
        # Notification.create(receiver_id: @chart.user.pcc.id, sender_id: current_user.id, subject: "A new #{@chart.type} chart for #{@chart.user.full_name} has been created.", content: "Please, review and approve the chart.", action_url: "/charts/#{@chart.id}")
      else
        # byebug
        @chart.next_step
      end
      session[:chart_step] = @chart.current_step
    end
    if @chart.new_record?
      # byebug
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
    respond_to do |format|
      format.html
      format.json {render json: @chart.data}
    end
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
