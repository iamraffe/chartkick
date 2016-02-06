class AddAttributesToChart < ActiveRecord::Migration
  def change
    add_column :charts, :type, :string
    add_reference :charts, :user, index: true
  end
end
