Rails.application.routes.draw do
  get 'pages/dashboard'

  devise_for :users
  # root to: 'pages#index'

  root to: "pages#dashboard"
  # root to: 'charts#index'

  get 'charts', to: 'charts#index', as: 'chart_index'

  get '/chart-session', to: 'charts#chart_session'

  post "/charts/export/", to: "charts#export"

  get '/charts/update-entries-session/:id', to: 'charts#update_entries_in_session'

  post '/charts/cholesterol/intervention', to: "charts#intervention_session"

  # post '/charts/cholesterol/intervention/:id/edit', to: "charts#edit_intervention_session"

  post "/notifications/mark-as-read/:id", to: "notifications#mark_as_read"

  resources :charts

  resources :interventions

  resources :entries

  resources :users do
    get :autocomplete_user_name, :on => :collection
    # resources :charts do
    #   resources :interventions
    #   resources :entries
    # end
  end

  get '/clean', to: 'charts#clean_session'

end
