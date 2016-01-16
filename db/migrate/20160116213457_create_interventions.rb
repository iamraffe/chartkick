class CreateInterventions < ActiveRecord::Migration
  def change
    create_table :interventions do |t|

      t.timestamps null: false
    end
  end
end
