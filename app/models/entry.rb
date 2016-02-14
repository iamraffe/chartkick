class Entry < ActiveRecord::Base
  belongs_to :user
  has_and_belongs_to_many :charts

  def self.create_and_link(chart, entries, interventions)
    entries["date"].each do |i,v|
      if !entries["db_value"].nil? && entries["db_value"]["#{i}"] == "1"
        entries.keys.select{|key| key != "date" && key != "db_value" }.each do |symbol|
          # byebug
          chart.entries << Entry.find(entries["db_value"][symbol.parameterize.underscore]["#{i}"].to_i)
        end
      else
        entries.keys.select{|key| key != "date" && key != "db_value" }.each do |symbol|
          chart.entries.create({symbol: symbol.humanize.upcase, date: v.to_datetime,value: entries[symbol.parameterize.underscore]["#{i}"].to_i, chart_type: chart.type,  user_id: chart.user.id})
        end
      end
    end

    interventions.each do |intervention|
      @intervention = Intervention.find_by(id: intervention["id"])
      if @intervention.nil?
        chart.interventions.create({title: intervention["title"], start: intervention["start"], end: intervention["end"], description: intervention["description"], index: intervention["index"], type: intervention["type"].classify, user_id: chart.user.id})
      else
        chart.interventions << @intervention
      end
    end
  end

  def self.build(user_id, chart_type, limit_size = 5)
    entries = Array.new(limit_size) { Hash.new }
    # byebug
    klass = chart_type.safe_constantize
    klass.keys.each_with_index do |key, index|
      results = Entry.select("value, date, id").where(user_id: user_id).where(chart_type: chart_type).where(symbol: key).order('date DESC').limit(limit_size).reverse
      results.each_with_index do |result, i|
        # byebug
        entries[i].deep_merge!({key.parameterize('_').to_sym => result.value, :date => result.date.strftime("%Y-%m-%d").to_s, id: {}})
        entries[i][:id].deep_merge!({key.parameterize.underscore.to_sym => result.id})
        # byebug
      end
    end
    # byebug
    entries
  end
end
