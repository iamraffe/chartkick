class PagesController < ApplicationController
  def index
    @data = [
        [Date.new(2014, 1),   0.4,  8.7],
        [Date.new(2014, 2),   0.5,   12],
        [Date.new(2014, 3),  2.9, 15.3],
        [Date.new(2014, 4),  1006.3, 18.6],
        [Date.new(2014, 5),    9, 20.9],
        [Date.new(2014, 6), 10.6, 19.8],
        [Date.new(2014, 7), 10.3, 16.6],
        [Date.new(2014, 8),  7.4, 13.3],
        [Date.new(2014, 9),  4.4,  9.9],
        [Date.new(2014, 10), 1.1,  6.6],
        [Date.new(2014, 11), -0.2,  4.5]
      ]
    render pdf: "index"
  end
end
