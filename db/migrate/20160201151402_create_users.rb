class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.date :date_of_birth
      t.string :first_name
      t.string :last_name
      # t.string :email
      t.string :gender
      t.string :phone_number
      t.boolean :diabetes
      t.boolean :heart_disease
      t.json :elation_payload
      t.integer :elation_id, limit: 8
      t.references :care_teams, index: true
      t.string :notify_every
      t.datetime :notify_by, null: false
      t.timestamps null: false
    end
  end
end
