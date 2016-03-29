module SessionHelper
  def self.parse(session)
    session[:entry_params].each{|key, value| value.delete_if {|k, v| v.empty? } }
    entry_params = session[:chart_params]["type"].safe_constantize.parse_entries(session[:entry_params])
    intervention = session[:intervention_params]
    {entries: entry_params, interventions: intervention}
  end

  def self.clean(session)
    session[:chart_step] = session[:chart_params] = session[:entry_params] = session[:intervention_params] = nil
  end
end