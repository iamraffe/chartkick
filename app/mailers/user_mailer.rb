class UserMailer < ApplicationMailer
  default from: 'notifications@example.com'
  def welcome_email(user, notifications)
    @user = user
    @notifications = notifications
    mail(to: "raffe90@gmail.com", subject: 'Welcome to My Awesome Site')
  end
end
