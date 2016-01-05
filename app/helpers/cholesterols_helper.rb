module CholesterolsHelper
  def construct_cholesterol_chart_from_session(data)
    chart_data = [{name: "LDL", data: {}},{name: "HDL", data: {}},{name: "TRIGLYCERIDES", data: {}},{name: "CHOLESTEROL", data: {}}]
    data['date'].each_with_index do |(key, date), index|
        chart_data.first[:data].merge!(date => data['ldl'][key])
        chart_data.second[:data].merge!(date => data['hdl'][key])
        chart_data.third[:data].merge!(date => data['triglycerides'][key])
        chart_data.fourth[:data].merge!(date => data['cholesterol'][key])
    end
    chart_data
  end

  def construct_cholesterol_chart_from_database(data)
    chart_data = [{name: "LDL", data: {}},{name: "HDL", data: {}},{name: "TRIGLYCERIDES", data: {}},{name: "CHOLESTEROL", data: {}}]
    data.each do |entry|
        chart_data.first[:data].merge!(entry.date => entry.ldl)
        chart_data.second[:data].merge!(entry.date => entry.hdl)
        chart_data.third[:data].merge!(entry.date => entry.triglycerides)
        chart_data.fourth[:data].merge!(entry.date => entry.cholesterol)
    end
    chart_data
  end
end
