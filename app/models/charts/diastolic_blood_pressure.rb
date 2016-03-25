class DiastolicBloodPressure < Chart
  def self.keys
    ["DIASTOLIC BLOOD PRESSURE"]
  end

  def self.parse_entries(entry_params)
    parsed_entries = Array.new
    entry_params["date"].each do |i,v|
      parsed_entries.push({symbol: "Diastolic Blood Pressure", date: v.to_time.strftime("%b %Y"), value: entry_params["diastolic_blood_pressure"]["#{i}"].to_i})
    end
    parsed_entries
  end
end
