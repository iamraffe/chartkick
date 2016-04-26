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
