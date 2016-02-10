class AddAttributesToEntry < ActiveRecord::Migration
  def change
    add_column :entries, :symbol, :string
    add_column :entries, :value, :integer
    add_column :entries, :date, :datetime
    add_column :entries, :chart_type, :string
    add_reference :entries, :user, index: true
  end
end
