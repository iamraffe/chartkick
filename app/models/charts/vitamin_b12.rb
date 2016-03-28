class VitaminB12 < Chart
  def self.keys
    ["VITAMIN B12"]
  end

  def self.parse_entries(entry_params)
    parsed_entries = Array.new
    entry_params["date"].each do |i,v|
      parsed_entries.push({symbol: "VITAMIN B12", date: v.to_time.strftime("%b %Y"), value: entry_params["vitamin_b12"]["#{i}"].to_i})
    end
    parsed_entries
  end
end
