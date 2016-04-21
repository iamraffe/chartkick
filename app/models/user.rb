class User < ActiveRecord::Base
  rolify
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable
  acts_as_reader

  has_many :charts
  has_many :entries
  has_many :interventions
  has_and_belongs_to_many :notifications

  has_many :patients, class_name: "User",
                          foreign_key: "pcc_id"

  belongs_to :pcc, class_name: "User"
end
