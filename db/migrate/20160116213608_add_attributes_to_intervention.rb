class AddAttributesToIntervention < ActiveRecord::Migration
  def change
    add_column :interventions, :title, :string
    add_column :interventions, :start, :datetime
    add_column :interventions, :end, :datetime
    add_column :interventions, :description, :string
    add_column :interventions, :index, :integer
    add_column :interventions, :type, :string
    add_reference :interventions, :user, index: true
    add_reference :interventions, :chart, index: true
  end
end
