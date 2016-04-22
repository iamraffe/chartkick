class InterventionsController < ApplicationController
  def index
    @interventions = Intervention.where(user_id: session[:chart_params]["user_id"].to_i).where(chart_type: session[:chart_params]["type"]).map {|intervention| intervention.decode! }
    session[:intervention_params] = Intervention.to_session(@interventions, session) unless @interventions.nil?
    render json: SessionHelper.parse(session)[:interventions]
  end

  def create
    @type = params[:intervention][params[:index].to_s]["type"]
    @index = params[:index]
    @interventions_size = session[:intervention_params].size
    session[:intervention_params].push(intervention_params[@index].deep_merge!({"id" => SecureRandom.hex(5)})) if intervention_params
    @interventions = session[:intervention_params].select{|k,v| k["type"] == @type}.to_json
    @d3_session_data = {entries: SessionHelper.parse(session)[:entries], interventions: [session[:intervention_params].last.deep_merge({"index" => (session[:intervention_params].size-1)})]}
    @save_and_exit = !params[:intervention]["save-and-exit"].nil?
    respond_to do |format|
      format.js   {}
      format.json { render json:{ status: "ok"} }
    end
  end

  def show

  end

  def update
    @intervention = Intervention.find_by(id: params[:id])
    @intervention.update_attributes(edit_intervention_params) unless @intervention.nil?
    @intervention = params[:edit_intervention].to_json if @intervention.nil?
    @type = params[:edit_intervention]["type"]
    session[:intervention_params][params[:edit_intervention]['index'].to_i]["title"] = params[:edit_intervention]['title']
    session[:intervention_params][params[:edit_intervention]['index'].to_i]["description"] = params[:edit_intervention]['description']
    session[:intervention_params][params[:edit_intervention]['index'].to_i]["start"] = params[:edit_intervention]['start']
    session[:intervention_params][params[:edit_intervention]['index'].to_i]["end"] = params[:edit_intervention]['end']
    @interventions = session[:intervention_params].select{|k,v| k["type"] == @type}.to_json
    @interventions_size = session[:intervention_params].size
    @update_and_exit = !params[:edit_intervention]["update-and-exit"].nil?
    respond_to do |format|
      format.js   {}
      format.json { render json:{ status: "ok"} }
    end
  end

  private
    def intervention_params
      params[:intervention].permit!
      # params[:intervention].permit(:type, :title, :description, :start, :end)
    end

    def edit_intervention_params
      params[:edit_intervention].permit!
    end
end
