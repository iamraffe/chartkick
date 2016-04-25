class Caregiver < ActiveRecord::Base
  belongs_to :user
  belongs_to :care_team

  # validate :team_has_one_leader_and_manager

  # Make sure player (worker or leader) is only on one team
  # validates :user_id, uniqueness: true, if: :is_player?

  # def is_player?
  #   ['worker', 'leader'].include? user.type
  # end

  # def team_has_one_leader_and_manager
  #   if ['leader', 'manager'].include?(user.type)
  #     if care_team.users.where('type = ? AND id != ?' user.type, user_id).count.any?
  #       errors.add(:care_team, "can't add another #{user.type}")
  #     end
  #   end
  # end
end
