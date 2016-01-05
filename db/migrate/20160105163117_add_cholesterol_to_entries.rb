class AddCholesterolToEntries < ActiveRecord::Migration
  def change
    add_column :entries, :cholesterol, :integer
  end
end
