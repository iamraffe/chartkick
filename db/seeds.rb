# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

# 6.times{Cholesterol.create({date: Faker::Date.backward(3650), ldl: Faker::Number.between(1, 500), hdl: Faker::Number.between(1, 500), triglycerides: Faker::Number.between(1, 500), cholesterol: Faker::Number.between(1, 500)})}

300.times do |i|
  User.create(name: Faker::Name.name, email: Faker::Internet.email, phone_number: Faker::PhoneNumber.phone_number, gender: ["M", "F"].sample, diabetes: [true, false].sample, heart_disease: [true, false].sample, date_of_birth: Faker::Time.between(50.years.ago, 35.years.ago), avatar: "http://pokeapi.co/media/img/#{i}.png")
  # User.find()
  # Entry.create(date: Faker::Time.between(50.years.ago, 35.years.ago).to_datetime, symbol: ["LDL", "HDL", "TRIGLYCERIDES", "CHOLESTEROL"].sample, value: Faker::Number.between(25, 400), user_id:)
  # Intervention.create(title: Faker::Lorem.sentence(2), description: Faker::Lorem.sentence(2), start: , end: , type: ["Medication", "Lifestyle", "Procedure"].sample)
end

User.create(name: "Michelle Benaim", email: Faker::Internet.email, phone_number: Faker::PhoneNumber.phone_number, gender: ["M", "F"].sample, diabetes: [true, false].sample, heart_disease: [true, false].sample, date_of_birth: Faker::Time.between(50.years.ago, 35.years.ago, avatar: "http://pokeapi.co/media/img/301.png"))
