class Entry < ActiveRecord::Base
  belongs_to :cholesterols

  def self.create_and_link(chart, entries)
    4.times do |i|
      Entry.create(date: entries["date"][i.to_s], ldl: entries["ldl"][i.to_s], hdl: entries["hdl"][i.to_s], cholesterol_id: chart.id, triglycerides: entries["triglycerides"][i.to_s])
    end
  end
end
