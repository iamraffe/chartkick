class InterventionsController < ApplicationController
  def index
    @interventions = Intervention.where(user_id: session[:chart_params]["user_id"].to_i).map {|intervention| intervention.decode! }
    session[:intervention_params] = Intervention.to_session(@interventions, session) unless @interventions.nil?
    # byebug
    render json: SessionHelper.parse(session)[:interventions]
  end

  def create
    # byebug
    @type = params[:intervention][params[:index].to_s]["type"]
    @index = params[:index]
    @interventions_size = session[:intervention_params].size
    session[:intervention_params].push(intervention_params[@index].deep_merge!({"id" => SecureRandom.hex(5)})) if intervention_params
    @interventions = session[:intervention_params].select{|k,v| k["type"] == @type}.to_json
    @d3_session_data = {entries: SessionHelper.parse(session)[:entries], interventions: [session[:intervention_params].last.deep_merge({"index" => (session[:intervention_params].size-1)})]}
    respond_to do |format|
      format.js   {}
      format.json { render json:{ status: "ok"} }
      # format.html
    end
  end

  def show

  end

  def update
    # byebug
    @type = params[:edit_intervention]["type"]
    # session[:intervention_params][params[:edit_intervention]['index'].to_i] = params[:edit_intervention]
    session[:intervention_params][params[:edit_intervention]['index'].to_i]["title"] = params[:edit_intervention]['title']
    session[:intervention_params][params[:edit_intervention]['index'].to_i]["description"] = params[:edit_intervention]['description']
    session[:intervention_params][params[:edit_intervention]['index'].to_i]["start"] = params[:edit_intervention]['start']
    session[:intervention_params][params[:edit_intervention]['index'].to_i]["end"] = params[:edit_intervention]['end']
    # @d3_session_data = {entries: SessionHelper.parse(session)[:entries], interventions: [session[:intervention_params][:edit_intervention]['index'].to_i]]}
    @interventions = session[:intervention_params].select{|k,v| k["type"] == @type}.to_json

    @interventions_size = session[:intervention_params].size

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
end
