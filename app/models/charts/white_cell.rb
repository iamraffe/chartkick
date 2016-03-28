class WhiteCell < Chart
  def self.keys
    ["WHITE CELL"]
  end

  def self.parse_entries(entry_params)
    parsed_entries = Array.new
    entry_params["date"].each do |i,v|
      parsed_entries.push({symbol: "WHITE CELL", date: v.to_time.strftime("%b %Y"), value: entry_params["white_cell"]["#{i}"].to_i})
    end
    parsed_entries
  end
end
