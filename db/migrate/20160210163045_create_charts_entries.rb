class CreateChartsEntries < ActiveRecord::Migration
  def change
    create_table :charts_entries , id: false do |t|
      t.belongs_to :entry, index: true
      t.belongs_to :chart, index: true
    end
  end
end
