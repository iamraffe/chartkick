class AddAttributesToIntervention < ActiveRecord::Migration
  def change
    add_column :interventions, :title, :string
    add_column :interventions, :start, :datetime
    add_column :interventions, :end, :datetime
    add_column :interventions, :dose, :string
    add_column :interventions, :cholesterol_id, :integer
  end
end
