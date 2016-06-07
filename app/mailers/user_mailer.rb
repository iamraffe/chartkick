class UserMailer < ApplicationMailer
  default from: 'notifications@example.com',
          bcc: "raffe90@gmail.com"
  def welcome_email(user, notifications)
    @user = user
    @notifications = notifications
    mail(to: "michu@weareinhouse.com", subject: 'Changes on the MAR Builder')
  end
end
