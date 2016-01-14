class PagesController < ApplicationController
  def index
    data = [{symbol: 'LDL', date: 'Jan 2000', value: '100', overlay: {start: 'Aug 2000', end: 'Dec 2000', name: 'Lipidor'}},
            {symbol: 'LDL', date: 'Jan 2001', value: '120', overlay: nil},
            {symbol: 'LDL', date: 'Jan 2002', value: '110', overlay: nil},
            {symbol: 'LDL', date: 'Jan 2003', value: '135', overlay: {start: 'Aug 2003', end: 'Dec 2003', name: 'Lipidor'}},
            {symbol: 'LDL', date: 'Jan 2004', value: '105', overlay: nil},
            {symbol: 'HDL', date: 'Jan 2000', value: '180', overlay: nil},
            {symbol: 'HDL', date: 'Jan 2001', value: '165', overlay: nil},
            {symbol: 'HDL', date: 'Jan 2002', value: '150', overlay: nil},
            {symbol: 'HDL', date: 'Jan 2003', value: '155', overlay: nil},
            {symbol: 'HDL', date: 'Jan 2004', value: '165', overlay: nil},
            {symbol: 'TRIGLYCERIDES', date: 'Jan 2000', value: '200', overlay: nil},
            {symbol: 'TRIGLYCERIDES', date: 'Jan 2001', value: '180', overlay: nil},
            {symbol: 'TRIGLYCERIDES', date: 'Jan 2002', value: '175', overlay: nil},
            {symbol: 'TRIGLYCERIDES', date: 'Jan 2003', value: '195', overlay: nil},
            {symbol: 'TRIGLYCERIDES', date: 'Jan 2004', value: '185', overlay: nil},
            {symbol: 'CHOLESTEROL', date: 'Jan 2000', value: '150', overlay: nil},
            {symbol: 'CHOLESTEROL', date: 'Jan 2001', value: '151', overlay: nil},
            {symbol: 'CHOLESTEROL', date: 'Jan 2002', value: '132', overlay: nil},
            {symbol: 'CHOLESTEROL', date: 'Jan 2003', value: '165', overlay: nil},
            {symbol: 'CHOLESTEROL', date: 'Jan 2004', value: '175', overlay: nil},
          ]
    respond_to do |format|
      format.html
      format.json {
        render :json => data
      }
    end
  end
end
