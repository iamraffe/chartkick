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

  def construct_table_from_session_params(data)
    table_data = ''
    data['date'].each_with_index do |(key, date), index|
        table_data +=      "<tr>"
        table_data +=        "<td><span id='fa-#{index}' class='fa fa-times text-danger'></span>#{(index+1)}</td>"
        table_data +=        "<td><input class='session-entry-values' type='date' name='entry[date[#{(index+1)}]]' placeholder='#{date}'></td>"
        table_data +=        "<td><input class='session-entry-values' type='text' name='entry[ldl[#{(index+1)}]]' placeholder='#{data['ldl'][key]}'></td>"
        table_data +=        "<td><input class='session-entry-values' type='text' name='entry[hdl[#{(index+1)}]]' placeholder='#{data['hdl'][key]}'></td>"
        table_data +=        "<td><input class='session-entry-values' type='text' name='entry[triglycerides[#{(index+1)}]]' placeholder='#{data['triglycerides'][key]}'></td>"
        table_data +=        "<td><input class='session-entry-values' type='text' name='entry[cholesterol[#{(index+1)}]]' placeholder='#{data['cholesterol'][key]}'></td>"
        table_data +=       "</tr>"
    end
    table_data
  end
end
