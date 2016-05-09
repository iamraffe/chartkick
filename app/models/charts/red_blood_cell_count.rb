class RedBloodCellCount < Chart
  def self.keys
    ["RED BLOOD CELL COUNT"]
  end

  def self.parse_entries(entry_params)
    parsed_entries = Array.new
    entry_params["date"].each do |i,v|
      parsed_entries.push({symbol: "RED BLOOD CELL COUNT", date: v.to_time.strftime("%b %Y"), value: entry_params["red_blood_cell_count"]["#{i}"].to_i})
    end
    parsed_entries
  end
end
