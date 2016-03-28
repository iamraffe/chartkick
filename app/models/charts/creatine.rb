class Creatine < Chart
  def self.keys
    ["CREATINE"]
  end

  def self.parse_entries(entry_params)
    parsed_entries = Array.new
    entry_params["date"].each do |i,v|
      parsed_entries.push({symbol: "CREATINE", date: v.to_time.strftime("%b %Y"), value: entry_params["creatine"]["#{i}"].to_i})
    end
    parsed_entries
  end
end
