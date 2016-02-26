class Notification < ActiveRecord::Base
  act_as_readable on: :created_at
end
