Rails.application.routes.draw do
  devise_for :user, :controllers => { :sessions => "users/sessions" }

  authenticated :user do
    root 'pages#dashboard', as: :authenticated_root
  end

  devise_scope :user do
    root :to => 'users/sessions#new'
  end

  get 'dashboard', to: 'pages#dashboard', as: :dashboard

  get 'charts', to: 'charts#index', as: 'chart_index'

  put 'charts/:id/approve', to: 'charts#approve', as: 'approve'

  get '/chart-session', to: 'charts#chart_session'

  post "/charts/export/", to: "charts#export"

  get '/charts/update-entries-session/:id', to: 'charts#update_entries_in_session'

  post "/notifications/mark-as-read/:id", to: "notifications#mark_as_read"

  post "/notifications/mark-all-as-read/", to: "notifications#mark_all_as_read"

  resources :charts

  resources :interventions

  resources :entries

  resources :users do
    get :autocomplete_user_full_name, :on => :collection
    # resources :charts do
    #   resources :interventions
    #   resources :entries
    # end
  end

  get '/clean', to: 'charts#clean_session'

end
