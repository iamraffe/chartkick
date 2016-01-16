class AddAttributesToEntry < ActiveRecord::Migration
  def change
    add_column :entries, :symbol, :string
    add_column :entries, :value, :integer
    add_column :entries, :date, :datetime
    add_column :entries, :cholesterol_id, :integer
  end
end
