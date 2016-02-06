class AddAttributesToEntry < ActiveRecord::Migration
  def change
    add_column :entries, :symbol, :string
    add_column :entries, :value, :integer
    add_column :entries, :date, :datetime
    add_reference :entries, :user, index: true
    add_reference :entries, :chart, index: true
  end
end
