require 'rails_helper'

describe 'user authentication' do
  let(:user) { FactoryGirl.create(:user) }

  it 'allows user to signin with valid credentials' do
    sign_user_in(user)
    expect(page).to have_content('Signed in successfully')
  end

  it 'does not allow user to signin with invalid credentials' do
    sign_user_in(user, password: "mywrongpassword")
    expect(page).to have_content('Invalid email or password')
  end

  it 'allows user to signout' do
    sign_user_in(user)
    click_link "Log out"
    expect(page).to have_content('Signed out successfully')
  end
end


