
# LET'S CLEAN UP FIRST

User.destroy_all

# CREATE NURSE

nurse = User.create({
          first_name: "Carla",
          last_name: "Espinosa",
          email: "nurse@example.com",
          password: "iamanurse",
          password_confirmation: "iamanurse",
          phone_number: Faker::PhoneNumber.phone_number,
          gender: "F",
          diabetes: [true, false].sample,
          heart_disease: [true, false].sample,
          date_of_birth: Faker::Time.between(50.years.ago, 35.years.ago),
          avatar: "http://vignette3.wikia.nocookie.net/scrubs/images/5/53/Square_Carla.png/revision/latest?cb=20110924075547"
        })

nurse.add_role :nurse

# CREATE DOCTOR

doctor = User.create({
            first_name: "Gregory",
            last_name: "House",
            email: "doctor@example.com",
            password: "iamadoctor",
            password_confirmation: "iamadoctor",
            phone_number: Faker::PhoneNumber.phone_number,
            gender: "M",
            diabetes: [true, false].sample,
            heart_disease: [true, false].sample,
            date_of_birth: Faker::Time.between(50.years.ago, 35.years.ago),
            avatar: "http://agentpalmer.com/wp-content/uploads/2012/05/Dr.-Gregory-House-MD-300x300.jpg"
          })

doctor.add_role :doctor

# CREATE NATUROPATH

naturopath = User.create({
              first_name: "Pete",
              last_name: "Wilder",
              email: "naturopath@example.com",
              password: "iamanaturopath",
              password_confirmation: "iamanaturopath",
              phone_number: Faker::PhoneNumber.phone_number,
              gender: "M",
              diabetes: [true, false].sample,
              heart_disease: [true, false].sample,
              date_of_birth: Faker::Time.between(50.years.ago, 35.years.ago),
              avatar: "http://s.plurielles.fr/mmdia/i/86/0/tim-daly-dr-pete-wilder-private-practice-4157860wombp_2041.jpg"
            })

naturopath.add_role :naturopath

CareTeam.destroy_all

# CREATE FIRST CARETEAM

c = CareTeam.create

c.users << nurse

c.users << doctor

c.users << naturopath

c.save

#  CREATE MICHU

u = User.create({
      first_name: "Michelle",
      last_name: "Benaim",
      email: "michu@example.com",
      password: "mysecretpassword",
      password_confirmation: "mysecretpassword",
      phone_number: Faker::PhoneNumber.phone_number,
      gender: ["M", "F"].sample,
      diabetes: [true, false].sample,
      heart_disease: [true, false].sample,
      date_of_birth: Faker::Time.between(50.years.ago, 35.years.ago),
      avatar: "http://blogs.mccombs.utexas.edu/mba-insider/files/2014/05/michu-benaim-wb71dy-150x150.jpg",
      # care_teams: c
    })

u.care_teams << c

# CREATE FIRST CARETEAM

c = CareTeam.create

c.users << nurse

c.users << doctor

c.save

u.add_role :patient

# CREATE ALL PATIENTS MAN

296.times do |i|
  u = User.create({
        first_name: Faker::Name.first_name,
        last_name: Faker::Name.last_name,
        email: Faker::Internet.email,
        password: "mysecretpassword",
        password_confirmation: "mysecretpassword",
        phone_number: Faker::PhoneNumber.phone_number,
        gender: ["M", "F"].sample,
        diabetes: [true, false].sample,
        heart_disease: [true, false].sample,
        date_of_birth: Faker::Time.between(50.years.ago, 5.years.ago),
        avatar: "https://randomuser.me/api/portraits/thumb/#{['men','women'].sample}/#{(0...99).to_a.sample}.jpg",
        # care_teams: c
      })

  u.care_teams << c

  u.add_role :patient
end



# Notification.create!(receiver_id: 301, sender_id: 1, subject: "A new Cholesterol chart for Michelle Benaim has been created.", content: "Please, review and approve the chart.", action_url: "/charts/1")
