class UsersController < ApplicationController
  autocomplete :user, :name, :full => true
end
