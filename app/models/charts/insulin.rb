class Insulin < Chart
  def self.keys
    ["INSULIN"]
  end

  def self.parse_entries(entry_params)
    parsed_entries = Array.new
    entry_params["date"].each do |i,v|
      parsed_entries.push({symbol: "Insulin", date: v.to_time.strftime("%b %Y"), value: entry_params["insulin"]["#{i}"].to_i})
    end
    parsed_entries
  end
end
