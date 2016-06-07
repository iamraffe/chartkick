#
# config/initializers/scheduler.rb
require 'rufus-scheduler'

# Let's use the rufus-scheduler singleton
#
s = Rufus::Scheduler.singleton

# Awesome recurrent task...
#
s.every '1h' do
  auth = {:username => ENV["api_username"], :password => ENV["api_password"]}
  @patients = HTTParty.get("https://api.test.elationemr.com/api/v1/patients/",
                       :basic_auth => auth, verify: false).parsed_response["results"]
  @patients.each do |patient|
    p = User.where(elation_id: patient["id"]).first
    if p.nil?
      Rails.logger.debug "hello, it's #{patient['id']}"
      # p["elation_id"] = p.delete "id"
      User.create!(password: "n3wp4t13n1", password_confirmation: "n3wp4t13n1", elation_id: patient["id"], email:  patient["email"].blank? ? "example@email.com" : patient["email"], first_name:  patient["first_name"], elation_payload: patient.to_json)
    else
      p.update_attributes(elation_payload: patient.to_json)
    end
  end
end

# Let's use the rufus-scheduler singleton
#
d = Rufus::Scheduler.singleton

# field          allowed values
# -----          --------------
# minute         0-59
# hour           0-23
# day of month   1-31
# month          1-12 (or names, see below)
# day of week    0-7 (0 or 7 is Sun, or use names)

d.cron '5 7 * * *' do
  @users = User.where("notify_by < ?", DateTime.current)
  @users.each do |user|
    case user.notify_every
      when "1.day"
        @notifications = Notification.where(delivered: false).where(receiver_id: user.id)
        if @notifications.size > 0
          UserMailer.welcome_email(user, @notifications.to_a).deliver_now
          Notification.where(delivered: false).where(receiver_id: user.id).update_all(delivered: true)
          user.update_attributes(notify_by: (DateTime.current+1.day).change({hour: 7}))
        end
      when "weekdays"
        today =  DateTime.current.wday
        if(today != 0 && today != 6)
          @notifications = Notification.where(delivered: false).where(receiver_id: user.id)
          if @notifications.size > 0
            UserMailer.welcome_email(user, @notifications.to_a).deliver_now
            notify_by = DateTime.current.friday? ? DateTime.current+3.day : DateTime.current+1.day
            Notification.where(delivered: false).where(receiver_id: user.id).update_all(delivered: true)
            user.update_attributes(notify_by: notify_by.change({hour: 7}))
          end
        end
      when "3.times.week"
        today =  DateTime.current.wday
        if(today == 1 || today == 3 || today == 5)
          @notifications = Notification.where(delivered: false).where(receiver_id: user.id)
          if @notifications.size > 0
            UserMailer.welcome_email(user, @notifications.to_a).deliver_now
            notify_by = today == 5 ? DateTime.current+3.day : DateTime.current+2.day
            Notification.where(delivered: false).where(receiver_id: user.id).update_all(delivered: true)
            user.update_attributes(notify_by: notify_by.change({hour: 7}))
          end
        end
      when -> (n) { (0...6).include? n.to_i }
        today =  DateTime.current.wday
        if(today == notify_every.to_i)
          @notifications = Notification.where(delivered: false).where(receiver_id: user.id)
          if @notifications.size > 0
            UserMailer.welcome_email(user, @notifications.to_a).deliver_now
            notify_by = DateTime.current+7.day
            Notification.where(delivered: false).where(receiver_id: user.id).update_all(delivered: true)
            user.update_attributes(notify_by: notify_by.change({hour: 7}))
          end
        end
    end
  end
end
