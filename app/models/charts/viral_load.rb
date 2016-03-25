class ViralLoad < Chart
  def self.keys
    ["VIRAL LOAD"]
  end

  def self.parse_entries(entry_params)
    parsed_entries = Array.new
    entry_params["date"].each do |i,v|
      parsed_entries.push({symbol: "Viral Load", date: v.to_time.strftime("%b %Y"), value: entry_params["viral_load"]["#{i}"].to_i})
    end
    parsed_entries
  end
end
