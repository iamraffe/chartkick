class HemoglobinA1c < Chart
  def self.keys
    ["HEMOGLOBIN A1C"]
  end

  def self.parse_entries(entry_params)
    parsed_entries = Array.new
    entry_params["date"].each do |i,v|
      parsed_entries.push({symbol: "HEMOGLOBIN A1C", date: v.to_time.strftime("%b %Y"), value: entry_params["hemoglobin_a1c"]["#{i}"].to_i})
    end
    parsed_entries
  end
end
