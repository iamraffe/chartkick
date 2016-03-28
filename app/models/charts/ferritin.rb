class Ferritin < Chart
  def self.keys
    ["FERRITIN"]
  end

  def self.parse_entries(entry_params)
    parsed_entries = Array.new
    entry_params["date"].each do |i,v|
      parsed_entries.push({symbol: "FERRITIN", date: v.to_time.strftime("%b %Y"), value: entry_params["ferritin"]["#{i}"].to_i})
    end
    parsed_entries
  end
end
