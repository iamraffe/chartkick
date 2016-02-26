class User < ActiveRecord::Base
  acts_as_reader

  has_many :charts
  has_many :entries
  has_many :interventions
end
