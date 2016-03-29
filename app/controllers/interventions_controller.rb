class InterventionsController < ApplicationController
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

  private
    def intervention_params
      params[:intervention].permit!
      # params[:intervention].permit(:type, :title, :description, :start, :end)
    end
end
