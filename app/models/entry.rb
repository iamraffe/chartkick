class Entry < ActiveRecord::Base
  belongs_to :cholesterols

  def self.create_and_link(chart, entries, interventions)
    # entries['date'].each_with_index do |(key, date), index|
    #   Entry.create(date: date, ldl: entries["ldl"][key], hdl: entries["hdl"][key], cholesterol_id: chart.id, triglycerides: entries["triglycerides"][key], cholesterol: entries["cholesterol"][key])
    # end
    entries["date"].each do |i,v|
      Entry.create({symbol: "LDL", date: v.to_datetime,value: entries["ldl"]["#{i}"].to_i, cholesterol_id: chart.id})
      # byebug
      Entry.create({symbol: "HDL", date: v.to_datetime, value: entries["hdl"]["#{i}"].to_i, cholesterol_id: chart.id})
      Entry.create({symbol: "TRIGLYCERIDES", date: v.to_datetime, value: entries["triglycerides"]["#{i}"].to_i, cholesterol_id: chart.id})
      Entry.create({symbol: "CHOLESTEROL", date: v.to_datetime, value: entries["cholesterol"]["#{i}"].to_i, cholesterol_id: chart.id})
    end
    # byebug
    Intervention.create({title: interventions["title"], start: interventions["start"], end: interventions["end"], dose: interventions["dose"], cholesterol_id: chart.id}) unless interventions.empty?

    # interventions.each do |intervention|
    #   Intervention.create()
    # end
  end
end
