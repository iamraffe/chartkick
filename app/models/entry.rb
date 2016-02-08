class Entry < ActiveRecord::Base
  belongs_to :user
  belongs_to :chart

  def self.create_and_link(chart, entries, interventions)
    entries["date"].each do |i,v|
      if !entries["db_value"].nil? && entries["db_value"]["#{i}"] == "1"
        entries.keys.select{|key| key != "date" && key != "db_value" }.each do |symbol|
          # byebug
          Entry.update(entries["db_value"][symbol.downcase]["#{i}"].to_i, {chart_id: chart.id})
        end
        # Entry.update(entries["db_value"]["ldl"]["#{i}"].to_i, {chart_id: chart.id})
        # Entry.update(entries["db_value"]["hdl"]["#{i}"].to_i, {chart_id: chart.id})
        # Entry.update(entries["db_value"]["triglycerides"]["#{i}"].to_i, {chart_id: chart.id})
        # Entry.update(entries["db_value"]["cholesterol"]["#{i}"].to_i, {chart_id: chart.id}) 
      else
        # byebug
        entries.keys.select{|key| key != "date" && key != "db_value" }.each do |symbol|
          Entry.create({symbol: symbol.humanize.upcase, date: v.to_datetime,value: entries[symbol.downcase]["#{i}"].to_i, chart_type: chart.type,  chart_id: chart.id, user_id: chart.user.id})
        end
        # Entry.create({symbol: "LDL", date: v.to_datetime,value: entries["ldl"]["#{i}"].to_i, chart_id: chart.id, user_id: chart.user.id})
        # Entry.create({symbol: "HDL", date: v.to_datetime, value: entries["hdl"]["#{i}"].to_i, chart_id: chart.id, user_id: chart.user.id})
        # Entry.create({symbol: "TRIGLYCERIDES", date: v.to_datetime, value: entries["triglycerides"]["#{i}"].to_i, chart_id: chart.id, user_id: chart.user.id})
        # Entry.create({symbol: "CHOLESTEROL", date: v.to_datetime, value: entries["cholesterol"]["#{i}"].to_i, chart_id: chart.id, user_id: chart.user.id})
      end
    end

    interventions.each do |intervention|
      Intervention.create({title: intervention["title"], start: intervention["start"], end: intervention["end"], description: intervention["description"], index: intervention["index"], type: intervention["type"].classify, chart_id: chart.id, user_id: chart.user.id})
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
