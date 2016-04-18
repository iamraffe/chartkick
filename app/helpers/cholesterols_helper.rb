module CholesterolsHelper
  def construct_table_from_session_params(data, chart_class, manual, size = 0)
    table_data = ''
    # byebug
    data['date'].each_with_index do |(key, date), index|
      unless !data["db_value"].nil? && data["db_value"][(index+1).to_s] == "1"
        table_data +=      "<tr>"
        table_data +=        "<td><span id='fa-#{index}' class='fa fa-times text-danger'></span>#{(index+1)}</td>"
        table_data +=        "<td><input class='session-entry-values session--input' type='date' name='entry[date[#{(index+1)}]]' placeholder='#{date}'></td>"
        # byebug
        chart_class.safe_constantize.keys.each do |k|
          table_data +=        "<td><input class='session-entry-values session--input' type='text' name='entry[#{k.parameterize.underscore}[#{(key)}]]' placeholder='#{data[k.parameterize.underscore.to_s][key]}'></td>"
          # byebug
        end
        table_data +=       "</tr>"
      end
    end
    table_data
  end

  def construct_table_from_database(entries, chart_class, manual)
    table_data = ''
    entries.each_with_index do |entry, index|
        table_data +=      "<tr class='info'>"
        table_data +=        "<td><input type='hidden' name='entry[db_value[#{(index+1)}]]' value='1'> #{(index+1)}</td>"
        table_data +=        "<td><input class='session-entry-values database--input disabled' type='date' name='entry[date[#{(index+1)}]]' placeholder='#{entry[:date]}' disabled></td>"
        # byebug
        chart_class.safe_constantize.keys.each do |key|
          table_data +=        "<td><input type='hidden' name='entry[db_value[#{key.parameterize.underscore}[#{(index+1)}]]]' value='#{entry[:id][key.parameterize.underscore.to_sym]}'><input disabled class='disabled session-entry-values database--input' type='text' name='entry[#{key.parameterize.underscore}[#{(index+1)}]]' placeholder='#{entry[key.parameterize.underscore.to_sym]}'></td>"
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
