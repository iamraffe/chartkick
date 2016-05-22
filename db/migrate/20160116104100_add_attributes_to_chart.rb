class AddAttributesToChart < ActiveRecord::Migration
  def change
    add_column :charts, :type, :string
    add_column :charts, :approved, :boolean, default: false
    add_column :charts, :opened, :boolean, default: false
    add_reference :charts, :user, index: true
  end
end
