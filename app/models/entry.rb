class Entry < ActiveRecord::Base
  belongs_to :cholesterols

  def self.create_and_link(chart, entries)
    entries['date'].each_with_index do |(key, date), index|
      Entry.create(date: date, ldl: entries["ldl"][key], hdl: entries["hdl"][key], cholesterol_id: chart.id, triglycerides: entries["triglycerides"][key], cholesterol: entries["cholesterol"][key])
    end
  end
end
