class Tsh < Chart
  def self.keys
    ["TSH"]
  end

  def self.parse_entries(entry_params)
    parsed_entries = Array.new
    entry_params["date"].each do |i,v|
      parsed_entries.push({symbol: "TSH", date: v.to_time.strftime("%b %Y"), value: entry_params["tsh"]["#{i}"].to_i})
    end
    parsed_entries
  end
end
