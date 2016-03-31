class Intervention < ActiveRecord::Base
  belongs_to :user
  has_and_belongs_to_many :charts

  def decode!
    {
      "start" => self.start.strftime("%Y-%m-%d").to_s,
      "end" => self.end.strftime("%Y-%m-%d").to_s,
      "title" => self.title,
      "description" => self.description,
      "index" => self.index,
      "type" => self.type.downcase,
      "chart_type" => self.chart_type.downcase,
      "id" => self.id
  }
  end

  def self.to_session(interventions, session)
    session[:intervention_params] = (interventions + session[:intervention_params]).uniq
    session[:intervention_params] = SessionHelper.parse(session)[:interventions].each_with_index{|v,k| puts v.deep_merge!({"index" => (k)})}
    session[:intervention_params] = SessionHelper.parse(session)[:interventions].delete_if{|i| i["start"].to_datetime > SessionHelper.parse(session)[:entries].last[:date].to_datetime || i["end"].to_datetime < SessionHelper.parse(session)[:entries].first[:date].to_datetime } 
    session[:intervention_params]
  end
end
