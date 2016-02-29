class Notification < ActiveRecord::Base
  acts_as_readable :on => :created_at
  has_and_belongs_to_many :users

  # def self.approve!
  #   self.mark_as_read! :for => User.find_by(id: self.receiver_id)
  # end
end
