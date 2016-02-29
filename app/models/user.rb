class User < ActiveRecord::Base
  acts_as_reader

  has_many :charts
  has_many :entries
  has_many :interventions
  has_and_belongs_to_many :notifications
end
