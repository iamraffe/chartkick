class CareTeam < ActiveRecord::Base
  has_many :caregivers
  has_many :users, through: :caregivers, dependent: :destroy

  # validate :has_one_leader_and_manager
  # validates_associated :caregivers # More on this later

  def doctor
    users.with_role(:doctor).first
  end

  def nurse
    users.with_role(:nurse).first
  end

  def naturopath
    users.with_role(:naturopath).first
  end

  def patients
    users.with_role :patient
  end

  def carers
    users.with_any_role(:doctor, :nurse, :naturopath)
  end

  # def has_one_leader_and_manager
  #   ['leader', 'manager'].each do |type|
  #     unless self.users.where(type: type).count == 1
  #       errors.add(:users, "need to have exactly one #{type}")
  #     end
  #   end
  # end
end
