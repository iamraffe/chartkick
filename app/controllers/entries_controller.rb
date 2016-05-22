class EntriesController < ApplicationController
  def update
    @chart = Chart.find(params[:id])
    session[:entry_params].deep_merge!(entry_params)
    Entry.update_entries(entry_params)
    respond_to do |format|
      format.js   {}
      format.json { render json:{ status: "ok"} }
    end
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
