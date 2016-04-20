FactoryGirl.define do
  factory :user do
    name "Rafa Ramírez"
    email Faker::Internet.email
    password "mysupersecretpassword"
  end
end
