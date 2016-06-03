class CreateNotifications < ActiveRecord::Migration
  def change
    create_table :notifications do |t|
      t.string :subject
      t.text :content
      t.integer :sender_id
      t.integer :receiver_id
      t.string :action_url
      t.boolean :delivered, default: false
      t.timestamps null: false
    end
  end
end
