Rails.application.routes.draw do
  devise_for :users
  # root to: 'pages#index'

  # post 'test', to: "pages#test"
  root to: 'charts#index'

  get 'charts', to: 'charts#index', as: 'chart_index'

  get '/chart-session', to: 'charts#chart_session'

  post "/charts/export/", to: "charts#export"

  get '/charts/cholesterol/update-session/:id', to: 'charts#update_session'

  post '/charts/cholesterol/intervention', to: "charts#intervention_session"

  post '/charts/cholesterol/intervention/:id/edit', to: "charts#edit_intervention_session"

  post "/notifications/mark-as-read/:id", to: "notifications#mark_as_read"

  resources :charts

  resources :users do
    get :autocomplete_user_name, :on => :collection
  end

  get '/clean', to: 'charts#clean_session'

end
