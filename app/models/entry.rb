class Entry < ActiveRecord::Base
  belongs_to :user
  has_and_belongs_to_many :charts

  def self.create_and_link(chart, entries, interventions)
    entries["date"].each do |i,v|
      if !entries["db_value"].nil? && entries["db_value"]["#{i}"] == "1"
        entries.keys.select{|key| key != "date" && key != "db_value" }.each do |symbol|
          chart.entries << Entry.find(entries["db_value"][symbol.downcase]["#{i}"].to_i)
        end
      else
        entries.keys.select{|key| key != "date" && key != "db_value" }.each do |symbol|
          chart.entries.create({symbol: symbol.humanize.upcase, date: v.to_datetime,value: entries[symbol.downcase]["#{i}"].to_i, chart_type: chart.type,  user_id: chart.user.id})
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

  def self.build(user_id, chart_type)
    entries = []
    ldl = Entry.where(user_id: user_id).where(chart_type: chart_type).where(symbol: "LDL").order('date DESC').limit(5).reverse
    hdl = Entry.where(user_id: user_id).where(chart_type: chart_type).where(symbol: "HDL").order('date DESC').limit(5).reverse
    triglycerides = Entry.where(user_id: user_id).where(chart_type: chart_type).where(symbol: "TRIGLYCERIDES").order('date DESC').limit(5).reverse
    cholesterol = Entry.where(user_id: user_id).where(chart_type: chart_type).where(symbol: "CHOLESTEROL").order('date DESC').limit(5).reverse
    # byebug
    ldl.size.times do |i|
      entries.push({date: ldl[i].date.strftime("%Y-%m-%d").to_s, ldl: ldl[i].value, hdl: hdl[i].value, triglycerides: triglycerides[i].value, cholesterol: cholesterol[i].value, id: {ldl: ldl[i].id, hdl: hdl[i].id, triglycerides: triglycerides[i].id, cholesterol: cholesterol[i].id}})
    end
    entries
  end
end
