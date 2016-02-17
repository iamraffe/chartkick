module CholesterolsHelper
  def construct_table_from_session_params(data, chart_class, manual, size = 0)
    table_data = ''
    # byebug
    data['date'].each_with_index do |(key, date), index|
      unless !data["db_value"].nil? && data["db_value"][(index+1).to_s] == "1"
        table_data +=      "<tr>"
        table_data +=        "<td><span id='fa-#{index}' class='fa fa-times text-danger'></span>#{(index+1)}</td>"
        table_data +=        "<td><input class='session-entry-values session--input' type='date' name='entry[date[#{(index+1)}]]' placeholder='#{date}'></td>"
        table_data +=        "<td><input class='session-entry-values session--input' type='text' name='entry[ldl[#{(index+1)}]]' placeholder='#{data['ldl'][key]}'></td>"
        table_data +=        "<td><input class='session-entry-values session--input' type='text' name='entry[hdl[#{(index+1)}]]' placeholder='#{data['hdl'][key]}'></td>"
        table_data +=        "<td><input class='session-entry-values session--input' type='text' name='entry[triglycerides[#{(index+1)}]]' placeholder='#{data['triglycerides'][key]}'></td>"
        table_data +=        "<td><input class='session-entry-values session--input' type='text' name='entry[cholesterol[#{(index+1)}]]' placeholder='#{data['cholesterol'][key]}'></td>"
        table_data +=       "</tr>"
      end
    end
    # byebug
    table_data
  end

  def construct_table_from_database(entries, chart_class, manual)
    table_data = ''
    entries.each_with_index do |entry, index|
        table_data +=      "<tr class='info'>"
        table_data +=        "<td><input type='hidden' name='entry[db_value[#{(index+1)}]]' value='1'> #{(index+1)}</td>"
        table_data +=        "<td><input class='session-entry-values database--input' type='date' name='entry[date[#{(index+1)}]]' placeholder='#{entry[:date]}'></td>"
        chart_class.safe_constantize.keys.each do |key|
          table_data +=        "<td><input type='hidden' name='entry[db_value[#{key.parameterize.underscore}[#{(index+1)}]]]' value='#{entry[:id][key.parameterize.underscore.to_sym]}'><input class='session-entry-values database--input' type='text' name='entry[#{key.parameterize.underscore}[#{(index+1)}]]' placeholder='#{entry[key.parameterize.underscore.to_sym]}'></td>"
        end
        table_data +=       "</tr>"
    end
    if manual == true
      table_data +=      "<tr>"
      table_data +=        "<td><span id='fa-#{entries.size}' class='fa fa-times text-danger'></span><input type='hidden' name='entry[db_value[#{(entries.size+1)}]]'> #{(entries.size+1)}</td>"
      table_data +=        "<td><input class='session-entry-values session--input' type='date' name='entry[date[#{(entries.size+1)}]]'></td>"
      chart_class.safe_constantize.keys.each do |key|
        table_data +=        "<td><input class='session-entry-values session--input' type='text' name='entry[#{key.parameterize.underscore}[#{(entries.size+1)}]]'></td>"
      end
      table_data +=       "</tr>"
    end
    table_data
  end
end
