class CreateNotificationsUsers < ActiveRecord::Migration
  def change
    create_table :notifications_users , id: false do |t|
      t.belongs_to :user, index: true
      t.belongs_to :notifications, index: true
    end
  end
end
