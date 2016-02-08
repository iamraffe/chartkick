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

  def construct_table_from_database(entries, manual)
    table_data = ''
    entries.each_with_index do |entry, index|
        table_data +=      "<tr class='info'>"
        # table_data +=        "<td><span id='fa-#{index}' class='fa fa-times text-danger'></span>#{(index+1)}</td>"
        table_data +=        "<td>#{(index+1)}</td>"
        table_data +=        "<td><input class='session-entry-values database--input' type='date' name='entry[date[#{(index+1)}]]' placeholder='#{entry[:date]}'></td>"
        table_data +=        "<td><input class='session-entry-values database--input' type='text' name='entry[ldl[#{(index+1)}]]' placeholder='#{entry[:ldl]}'></td>"
        table_data +=        "<td><input class='session-entry-values database--input' type='text' name='entry[hdl[#{(index+1)}]]' placeholder='#{entry[:hdl]}'></td>"
        table_data +=        "<td><input class='session-entry-values database--input' type='text' name='entry[triglycerides[#{(index+1)}]]' placeholder='#{entry[:triglycerides]}'></td>"
        table_data +=        "<td><input class='session-entry-values database--input' type='text' name='entry[cholesterol[#{(index+1)}]]' placeholder='#{entry[:cholesterol]}'></td>"
        table_data +=       "</tr>"
    end
    if manual
      table_data +=      "<tr>"
      table_data +=        "<td><span id='fa-#{entries.size}' class='fa fa-times text-danger'></span>#{(entries.size+1)}</td>"
      table_data +=        "<td><input class='session-entry-values database--input' type='date' name='entry[date[#{(entries.size+1)}]]'></td>"
      table_data +=        "<td><input class='session-entry-values database--input' type='text' name='entry[ldl[#{(entries.size+1)}]]'></td>"
      table_data +=        "<td><input class='session-entry-values database--input' type='text' name='entry[hdl[#{(entries.size+1)}]]'></td>"
      table_data +=        "<td><input class='session-entry-values database--input' type='text' name='entry[triglycerides[#{(entries.size+1)}]]'></td>"
      table_data +=        "<td><input class='session-entry-values database--input' type='text' name='entry[cholesterol[#{(entries.size+1)}]]'></td>"
      table_data +=       "</tr>"
    end
    table_data
  end
end
