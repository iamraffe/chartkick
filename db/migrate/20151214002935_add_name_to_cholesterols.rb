class AddNameToCholesterols < ActiveRecord::Migration
  def change
    add_column :cholesterols, :name, :string
  end
end
