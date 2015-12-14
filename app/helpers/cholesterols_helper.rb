module CholesterolsHelper
  def construct_chart_data(data)
    # byebug
    chart_data = [
                  {name: "LDL", data: {
                        data["date"]["0"] => data["ldl"]["0"],
                        data["date"]["1"] => data["ldl"]["1"],
                        data["date"]["2"] => data["ldl"]["2"],
                        data["date"]["3"] => data["ldl"]["3"],
                    }},
                  {name: "HDL", data: {
                        data["date"]["0"] => data["hdl"]["0"],
                        data["date"]["1"] => data["hdl"]["1"],
                        data["date"]["2"] => data["hdl"]["2"],
                        data["date"]["3"] => data["hdl"]["3"],
                    }},
                  {name: "TRIGLYCERIDS", data: {
                        data["date"]["0"] => data["triglycerides"]["0"],
                        data["date"]["1"] => data["triglycerides"]["1"],
                        data["date"]["2"] => data["triglycerides"]["2"],
                        data["date"]["3"] => data["triglycerides"]["3"],
                    }}
                ]
  end

  def construct_saved_chart(data)
    # organized_data = Hash.new()
    # # byebug
    # chart_data = [{name: "LDL", data: {}},{name: "HDL", data: {}},{name: "TRIGLYCERIDS", data: {}}]
    # data.each_with_index do |entry, index|
    #   organized_data["ldl"] = {entry.date.to_s => entry.ldl}
    #   # organized_data["ldl"][entry.date.to_s] = entry.ldl
    #   # organized_data["hdl"] = {entry.date.to_s => entry.hdl}
    #   # organized_data["triglycerides"] = {entry.date.to_s => entry.triglycerides}
    #   # byebug
    # end
    # organized_data
    # # byebug
    chart_data = [
                  {name: "LDL", data: {
                        data.first.date => data.first.ldl,
                        data.second.date => data.second.ldl,
                        data.third.date => data.third.ldl,
                        data.fourth.date => data.fourth.ldl,
                    }},
                  {name: "HDL", data: {
                        data.first.date => data.first.hdl,
                        data.second.date => data.second.hdl,
                        data.third.date => data.third.hdl,
                        data.fourth.date => data.fourth.hdl,
                    }},
                  {name: "TRIGLYCERIDS", data: {
                        data.first.date => data.first.triglycerides,
                        data.second.date => data.second.triglycerides,
                        data.third.date => data.third.triglycerides,
                        data.fourth.date => data.fourth.triglycerides,
                    }}
                ]
  end
end
