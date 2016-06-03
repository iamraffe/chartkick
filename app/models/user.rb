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

  # has_many :patients, class_name: "User",
  #                         foreign_key: "pcc_id"

  # belongs_to :pcc, class_name: "User"

  scope :full_name, lambda { |query|
    query.downcase!
   (query ? where(["LOWER(first_name) ILIKE ? OR LOWER(last_name) ILIKE ? OR CONCAT(LOWER(first_name), ' ', LOWER(last_name)) ILIKE ?", '%'+ query + '%', '%'+ query + '%','%'+ query + '%' ])  : {})
  }

  def full_name
    "#{first_name} #{last_name}"
  end

  def is_physician?
    has_role?(:doctor) || has_role?(:naturopath)
  end

  has_many :caregivers
  has_many :care_teams, through: :caregivers, dependent: :destroy

  # validates_associated :caregivers # More on this later

  # for workers and leaders
  def primary_care_team
    care_teams.first
  end

  before_create :notification_default_settings

  private
    def notification_default_settings
      self.notify_by = (DateTime.current+1.day).change({hour: 7})
      self.notify_every = "1.day"
    end
end
