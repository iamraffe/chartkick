class CreateCaregivers < ActiveRecord::Migration
  def change
    create_table :caregivers do |t|
      t.references :user
      t.references :care_team
      t.timestamps null: false
    end
  end
end
