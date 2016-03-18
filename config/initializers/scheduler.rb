#
# config/initializers/scheduler.rb
require 'rufus-scheduler'

# Let's use the rufus-scheduler singleton
#
s = Rufus::Scheduler.singleton

# Awesome recurrent task...
#
s.every '5m' do
  auth = {:username => ENV["api_username"], :password => ENV["api_password"]}
  @patients = HTTParty.get("https://api.test.elationemr.com/api/v1/patients/", 
                       :basic_auth => auth, verify: false).parsed_response["results"]
  @patients.each do |patient|
    p = User.where(elation_id: patient["id"])
    if p.nil?
      # p["elation_id"] = p.delete "id"
      User.create(password: "", password_confirmation: "", 
                  elation_id: patient["id"], email:  patient["email"],
                  name:  patient["first_name"], elation_payload: patient.to_json)
    else
      p.elation_payload = p.to_json
      p.save
    end
  end
end