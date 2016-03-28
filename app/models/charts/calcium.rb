class Calcium < Chart
  def self.keys
    ["CALCIUM"]
  end

  def self.parse_entries(entry_params)
    parsed_entries = Array.new
    entry_params["date"].each do |i,v|
      parsed_entries.push({symbol: "CALCIUM", date: v.to_time.strftime("%b %Y"), value: entry_params["calcium"]["#{i}"].to_i})
    end
    parsed_entries
  end
end
