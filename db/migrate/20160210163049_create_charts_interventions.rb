class CreateChartsInterventions < ActiveRecord::Migration
  def change
    create_table :charts_interventions , id: false do |t|
      t.belongs_to :chart, index: true
      t.belongs_to :intervention, index: true
    end
  end
end
