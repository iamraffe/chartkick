class RedCell < Chart
  def self.keys
    ["RED CELL"]
  end

  def self.parse_entries(entry_params)
    parsed_entries = Array.new
    entry_params["date"].each do |i,v|
      parsed_entries.push({symbol: "RED CELL", date: v.to_time.strftime("%b %Y"), value: entry_params["red_cell"]["#{i}"].to_i})
    end
    parsed_entries
  end
end
