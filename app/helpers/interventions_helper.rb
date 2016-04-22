module InterventionsHelper

  def create_form_input(type)
    case type
      when "medication"
        '<div class="col-xs-8 col-xs-offset-1">
          <div class="col-sm-4">
            <label for="intervention[description]" class="pull-right">Dose</label>
          </div>
          <div class="col-sm-8">
            <div class="form-group">
              <input type="text" class="form-control" name="intervention[1][description]" placeholder="(ie: 40mg, 20mg...)">
            </div>
          </div>
        </div>'
      when "lifestyle"
  '      <div class="col-xs-8 col-xs-offset-1">
            <div class="col-sm-4">
              <label for="intervention[1][description]" class="pull-right">Description</label>
            </div>
            <div class="col-sm-8">
              <div class="form-group">
                <input type="text" class="form-control" name="intervention[1][description]" placeholder="(ie: gluten-free, low-carb, gym...)">
              </div>
            </div>
          </div>'
      when "event"

    end

  end
end
