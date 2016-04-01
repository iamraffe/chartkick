class ChartsController < ApplicationController
  before_action :check_for_notifications

  def index
  end

  def new
    session[:chart_params] ||= {}
    session[:entry_params] ||= {}
    session[:intervention_params] ||= []
    @chart = Chart.new(session[:chart_params].deep_merge!({type: params[:type].classify}))
    @chart.current_step = session[:chart_step] unless session[:chart_step].nil?
  end

  def create
    session[:chart_params].deep_merge!(chart_params) if chart_params
    session[:entry_params].deep_merge!(entry_params) if entry_params
    @chart = Chart.new(session[:chart_params])
    @chart.current_step = session[:chart_step] unless session[:chart_step].nil?
    if @chart.valid?
      if params[:back_button]
        @chart.previous_step
      elsif @chart.last_step?
        @chart.save if @chart.all_valid?
        Entry.create_and_link(@chart, session[:entry_params])
        Intervention.create_and_link(@chart, session[:intervention_params])
      else
        @chart.next_step
      end
      session[:chart_step] = @chart.current_step
    end
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

    # @chart_data =

    # all_entries = @chart.entries.map { |e| e.decode!.symbolize_keys }

    # all_interventions = @chart.interventions.map{|i| i.decode!.symbolize_keys }

    # @chart_data = {entries: all_entries, interventions: all_interventions}

    respond_to do |format|
      format.html
      format.json {render json: @chart.data}
    end
  end

  def export
    image = Magick::Image.from_blob(params[:blob]) {
      self.format = 'SVG'
      self.background_color = 'transparent'
    }

    image.first.format = 'PNG'

    png = Base64.encode64(image.first.to_blob)

    respond_to do |format|
      format.html
      format.js
      format.json {
        render :json => {png: png}
      }
    end
  end

  def chart_session
    # byebug
    @interventions = Intervention.where(user_id: session[:chart_params]["user_id"].to_i).where(chart_type: session[:chart_params]["type"]).map {|intervention| intervention.decode! }
    # byebug
    session[:intervention_params] = Intervention.to_session(@interventions, session) unless @interventions.nil?
    # byebug
    render json: SessionHelper.parse(session)
  end

  def update_entries_in_session
    session[:entry_params].each{|key, value| value.delete("#{params[:id].to_i+1}") }
    render json:{ status: "ok"}
  end

  # def edit_intervention_session
  #   @type = params[:edit_intervention]["type"]
  #   session[:intervention_params][params[:id].to_i]["title"] = params[:edit_intervention]['title']
  #   session[:intervention_params][params[:id].to_i]["description"] = params[:edit_intervention]['description']
  #   session[:intervention_params][params[:id].to_i]["start"] = params[:edit_intervention]['start']
  #   session[:intervention_params][params[:id].to_i]["end"] = params[:edit_intervention]['end']
  #   @d3_session_data = {entries: SessionHelper.parse(session)[:entries], interventions: [session[:intervention_params][params[:id].to_i]]}
  #   @interventions = session[:intervention_params].select{|k,v| k["type"] == @type}.to_json
  #   @interventions_size = session[:intervention_params].size
  #   respond_to do |format|
  #     format.js   {}
  #     format.json { render json:{ status: "ok"} }
  #   end
  # end

  def clean_session
    SessionHelper.clean(session)
    redirect_to chart_index_path
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

    def check_for_notifications
      current_user = User.find(301)
      # Notification.mark_as_read! :all, :for => current_user
      # (0...10).to_a.sample.times do |i|
      #   Notification.create!(receiver_id: 301, sender_id: 1, subject: Faker::Lorem.sentence, content: Faker::Lorem.paragraph)
      # end

      @notifications = Notification.where(receiver_id: 301).order(created_at: :desc).unread_by(current_user)
    end
end
