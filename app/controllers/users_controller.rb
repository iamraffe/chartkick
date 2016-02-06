class UsersController < ApplicationController
  autocomplete :user, :name, :full => true, :extra_data => [:id]
end
