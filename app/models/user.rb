class User < ActiveRecord::Base
  has_many :charts
  has_many :entries
  has_many :interventions
end
