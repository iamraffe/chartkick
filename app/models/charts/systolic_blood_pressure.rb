class SystolicBloodPressure < Chart
  def self.keys
    ["SYSTOLIC BLOOD PRESSURE"]
  end

  def self.parse_entries(entry_params)
    parsed_entries = Array.new
    entry_params["date"].each do |i,v|
      parsed_entries.push({symbol: "SYSTOLIC BLOOD PRESSURE", date: v.to_time.strftime("%b %Y"), value: entry_params["systolic_blood_pressure"]["#{i}"].to_i})
    end
    parsed_entries
  end
end
