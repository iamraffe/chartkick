def sign_user_in(user, opts = {})
  visit new_user_session_path
  fill_in "Email Address", with: user.email
  fill_in "Password", with: (opts[:password] || user.password)
  click_button "Log In"
end

