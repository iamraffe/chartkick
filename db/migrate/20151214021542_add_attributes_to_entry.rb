class AddAttributesToEntry < ActiveRecord::Migration
  def change
    add_column :entries, :cholesterol_id, :integer
    add_column :entries, :ldl, :integer
    add_column :entries, :date, :date
    add_column :entries, :hdl, :integer
    add_column :entries, :triglycerides, :integer
  end
end
