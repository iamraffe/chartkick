class Cholesterol < Chart
  def self.keys
    ["LDL", "HDL", "TRIGLYCERIDES", "CHOLESTEROL"]
  end

  def self.parse_entries(entry_params)
    parsed_entries = Array.new
    entry_params["date"].each do |i,v|
        ldl = {symbol: "LDL", date: v.to_time.strftime("%b %Y"),value: entry_params["ldl"]["#{i}"].to_i}
        hdl = {symbol: "HDL", date: v.to_time.strftime("%b %Y"), value: entry_params["hdl"]["#{i}"].to_i}
        triglycerides = {symbol: "TRIGLYCERIDES", date: v.to_time.strftime("%b %Y"), value: entry_params["triglycerides"]["#{i}"].to_i}
        cholesterol = {symbol: "CHOLESTEROL", date: v.to_time.strftime("%b %Y"), value: entry_params["cholesterol"]["#{i}"].to_i}
        parsed_entries.push(ldl,hdl, triglycerides, cholesterol)
    end
    parsed_entries
  end
end
