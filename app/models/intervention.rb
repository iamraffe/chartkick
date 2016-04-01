class Intervention < ActiveRecord::Base
  belongs_to :user
  has_and_belongs_to_many :charts

  def self.create_and_link(chart, interventions)
    # byebug
    interventions.each do |intervention|
      @intervention = Intervention.find_by(id: intervention["id"])
      if @intervention.nil?
        chart.interventions.create({title: intervention["title"], start: intervention["start"], end: intervention["end"], description: intervention["description"], index: intervention["index"], type: intervention["type"].classify, user_id: chart.user.id, chart_type: chart.type})
      else
        chart.interventions << @intervention
      end
    end
  end

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
