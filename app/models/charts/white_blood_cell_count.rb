class WhiteBloodCellCount < Chart
  def self.keys
    ["WHITE BLOOD CELL COUNT"]
  end

  def self.parse_entries(entry_params)
    parsed_entries = Array.new
    entry_params["date"].each do |i,v|
      parsed_entries.push({symbol: "WHITE BLOOD CELL COUNT", date: v.to_time.strftime("%b %Y"), value: entry_params["white_blood_cell_count"]["#{i}"].to_i})
    end
    parsed_entries
  end
end
