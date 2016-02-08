class Entry < ActiveRecord::Base
  belongs_to :user
  belongs_to :chart

  def self.create_and_link(chart, entries, interventions)

    entries["date"].each do |i,v|
      Entry.create({symbol: "LDL", date: v.to_datetime,value: entries["ldl"]["#{i}"].to_i, chart_id: chart.id, user_id: chart.user.id})
      Entry.create({symbol: "HDL", date: v.to_datetime, value: entries["hdl"]["#{i}"].to_i, chart_id: chart.id, user_id: chart.user.id})
      Entry.create({symbol: "TRIGLYCERIDES", date: v.to_datetime, value: entries["triglycerides"]["#{i}"].to_i, chart_id: chart.id, user_id: chart.user.id})
      Entry.create({symbol: "CHOLESTEROL", date: v.to_datetime, value: entries["cholesterol"]["#{i}"].to_i, chart_id: chart.id, user_id: chart.user.id})
    end

    interventions.each do |intervention|
      Intervention.create({title: intervention["title"], start: intervention["start"], end: intervention["end"], description: intervention["description"], index: intervention["index"], type: intervention["type"], chart_id: chart.id, user_id: chart.user.id})
    end
  end

  def self.build(user_id)
    entries = []
    ldl = Entry.where(user_id: user_id).where(symbol: "LDL").order('date ASC').limit(5)
    hdl = Entry.where(user_id: user_id).where(symbol: "HDL").order('date ASC').limit(5)
    triglycerides = Entry.where(user_id: user_id).where(symbol: "TRIGLYCERIDES").order('date ASC').limit(5)
    cholesterol = Entry.where(user_id: user_id).where(symbol: "CHOLESTEROL").order('date ASC').limit(5)
    # byebug
    ldl.size.times do |i|
      entries.push({date: ldl[i].date.strftime("%Y-%m-%d").to_s, ldl: ldl[i].value, hdl: hdl[i].value, triglycerides: triglycerides[i].value, cholesterol: cholesterol[i].value})
    end
    entries
  end
end
