class ChartsController < ApplicationController
  before_filter :default_format_js, only: :intervention_session

  def default_format_js
    response.headers["Content-Type"] = 'text/javascript'

      # reponse.headers['content--type'] = 'text/javascript'
      request.format = 'js'
  end

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
        Entry.create_and_link(@chart, session[:entry_params], session[:intervention_params])
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
    @chart = Chart.find params[:id]
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
        description: intervention.description,
        index: intervention.index,
        type: intervention.type.downcase,
        id: intervention.id
      }
    end
    @chart_data = {entries: all_entries, interventions: all_interventions}

    respond_to do |format|
      format.html
      format.json {render json: {entries: all_entries, interventions: all_interventions}}
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
    @interventions = User.find(session[:chart_params]["user_id"].to_i).interventions.map do |intervention|
      {
        "start" => intervention.start.strftime("%Y-%m-%d").to_s,
        "end" => intervention.end.strftime("%Y-%m-%d").to_s,
        "title" => intervention.title,
        "description" => intervention.description,
        "index" => intervention.index,
        "type" => intervention.type.downcase,
        "id" => intervention.id
      }
    end
    session[:intervention_params] = (@interventions + session[:intervention_params]).uniq
    session[:intervention_params] = parse_session[:interventions].each_with_index{|v,k| puts v.deep_merge!({"index" => (k)})}
    session[:intervention_params] = parse_session[:interventions].delete_if{|i| i["start"].to_datetime > parse_session[:entries].last[:date].to_datetime || i["end"].to_datetime < parse_session[:entries].first[:date].to_datetime }
    render json: parse_session
  end

  def update_session
    session[:entry_params].each{|key, value| value.delete("#{params[:id].to_i+1}") }
    render json:{ status: "ok"}
  end

  def intervention_session
    # byebug
    @type = params[:intervention][params[:index].to_s]["type"]
    @index = params[:index]
    @interventions_size = session[:intervention_params].size
    session[:intervention_params].push(intervention_params[@index].deep_merge!({"id" => SecureRandom.hex(5)})) if intervention_params
    @interventions = session[:intervention_params].select{|k,v| k["type"] == @type}.to_json
    @d3_session_data = {entries: parse_session[:entries], interventions: [session[:intervention_params].last.deep_merge({"index" => (session[:intervention_params].size-1)})]}
    respond_to do |format|
      format.js   {}
      format.json { render json:{ status: "ok"} }
      # format.html
    end
  end

  def edit_intervention_session
    @type = params[:edit_intervention]["type"]
    session[:intervention_params][params[:id].to_i]["title"] = params[:edit_intervention]['title']
    session[:intervention_params][params[:id].to_i]["description"] = params[:edit_intervention]['description']
    session[:intervention_params][params[:id].to_i]["start"] = params[:edit_intervention]['start']
    session[:intervention_params][params[:id].to_i]["end"] = params[:edit_intervention]['end']
    @d3_session_data = {entries: parse_session[:entries], interventions: [session[:intervention_params][params[:id].to_i]]}
    @interventions = session[:intervention_params].select{|k,v| k["type"] == @type}.to_json
    @interventions_size = session[:intervention_params].size
    respond_to do |format|
      format.js   {}
      format.json { render json:{ status: "ok"} }
    end
  end

  def parse_session
    session[:entry_params].each{|key, value| value.delete_if {|k, v| v.empty? } }
    entry_params = session[:chart_params]["type"].safe_constantize.parse_entries(session[:entry_params])
    intervention = session[:intervention_params]
    {entries: entry_params, interventions: intervention}
  end

  def clean_session
    session[:chart_step] = session[:chart_params] = session[:entry_params] = session[:intervention_params] = nil
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
end
