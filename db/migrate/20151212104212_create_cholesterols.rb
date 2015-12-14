class CreateCholesterols < ActiveRecord::Migration
  def change
    create_table :cholesterols do |t|

      t.timestamps null: false
    end
  end
end
