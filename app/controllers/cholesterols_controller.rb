class CholesterolsController < ApplicationController
  # before_action :create_entries, only: [:create]
  def new
    session[:chart_params] ||= {}
    session[:entry_params] ||= {}
    session[:intervention_params] ||= []
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
    # byebug
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
        description: intervention.description,
        index: intervention.index,
        type: intervention.intervention_type
      }
    end
    @chart_data = {entries: all_entries, interventions: all_interventions}
    # byebug

    respond_to do |format|
      format.html
      format.json {render json: {entries: all_entries, interventions: all_interventions}}
      format.pdf do
        render pdf: "show", layout: 'pdf.html.erb'   # Excluding ".pdf" extension.
      end
      format.png do
        html = render_to_string(:file => '/cholesterols/show', :layout => '/layouts/application')
        @kit = IMGKit.new(html)
        @kit.stylesheets << "#{Rails.root}/app/assets/stylesheets/application.scss"
        @kit.javascripts << "#{Rails.root}/app/assets/javascripts/application.js"
        send_data(@kit.to_png, :type => "image/png", :disposition => 'inline')
      end
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

  def cholesterol_session  
    parse_session[:interventions].each_with_index{|v,k| puts v.deep_merge!({"index" => (k)})}
    render json: parse_session
  end

  def update_session
    session[:entry_params].each{|key, value| value.delete("#{params[:id].to_i+1}") }
    render json:{ status: "ok"}
  end

  def intervention_session
    @type = params[:intervention][params[:index].to_s]["type"]
    @index = params[:index]
    @interventions_size = session[:intervention_params].size
    # byebug
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
    # byebug
    respond_to do |format|
      format.js   {}
      format.json { render json:{ status: "ok"} }
    end
  end

  def parse_session
    entry_params = Array.new
    session[:entry_params].each{|key, value| value.delete_if {|k, v| v.empty? } }
    # byebug
    # session[:entry_params].delete_if {|key, value| value.nil? }
    session[:entry_params]["date"].each do |i,v|
      # byebug
      ldl = {symbol: "LDL", date: v.to_time.strftime("%b %Y"),value: session[:entry_params]["ldl"]["#{i}"].to_i}
      hdl = {symbol: "HDL", date: v.to_time.strftime("%b %Y"), value: session[:entry_params]["hdl"]["#{i}"].to_i}
      triglycerides = {symbol: "TRIGLYCERIDES", date: v.to_time.strftime("%b %Y"), value: session[:entry_params]["triglycerides"]["#{i}"].to_i}
      cholesterol = {symbol: "CHOLESTEROL", date: v.to_time.strftime("%b %Y"), value: session[:entry_params]["cholesterol"]["#{i}"].to_i}
      entry_params.push(ldl,hdl, triglycerides, cholesterol)
    end
    intervention = session[:intervention_params]
    {entries: entry_params, interventions: intervention}
  end

  def clean_session
    session[:chart_step] = session[:chart_params] = session[:entry_params] = session[:intervention_params] = nil
    redirect_to new_cholesterol_path
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
