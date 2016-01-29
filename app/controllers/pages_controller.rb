class PagesController < ApplicationController
  def index
data = [
    {date: '20111001', temperature: 62.7, symbol: 'F', clip: "above"},
    {date: '20111002', temperature: 59.9, symbol: 'F', clip: "above"},
    {date: '20111003', temperature: 59.1, symbol: 'F', clip: "above"},
    {date: '20111004', temperature: 58.8, symbol: 'F', clip: "above"},
    {date: '20111005', temperature: 58.7, symbol: 'F', clip: "above"},
    {date: '20111006', temperature: 57.0, symbol: 'F', clip: "below"},
    {date: '20111007', temperature: 56.7, symbol: 'F', clip: "below"},
    {date: '20111008', temperature: 56.8, symbol: 'F', clip: "below"},
    {date: '20111009', temperature: 56.7, symbol: 'F', clip: "below"},
    {date: '20111010', temperature: 60.1, symbol: 'F', clip: "below"},
  ];


    respond_to do |format|
      format.html
      format.json {
        render :json => data
      }
    end
  end
end
