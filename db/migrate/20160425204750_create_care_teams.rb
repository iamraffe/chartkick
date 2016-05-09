class CreateCareTeams < ActiveRecord::Migration
  def change
    create_table :care_teams do |t|
      t.string :name
      t.timestamps null: false
    end
  end
end
