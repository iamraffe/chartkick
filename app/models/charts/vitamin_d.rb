class VitaminD < Chart
  def self.keys
    ["VITAMIN D"]
  end

  def self.parse_entries(entry_params)
    parsed_entries = Array.new
    entry_params["date"].each do |i,v|
      parsed_entries.push({symbol: "Vitamin D", date: v.to_time.strftime("%b %Y"), value: entry_params["vitamin_d"]["#{i}"].to_i})
    end
    parsed_entries
  end
end
