Rails.application.routes.draw do
  # root to: 'pages#index'

  # post 'test', to: "pages#test"
  root to: 'charts#index'

  get 'charts', to: 'charts#index', as: 'chart_index'

  get '/cholesterol-session', to: 'cholesterols#cholesterol_session'

  post "/charts/cholesterol/export/", to: "cholesterols#export"

  get '/charts/cholesterol/update-session/:id', to: 'cholesterols#update_session'

  post '/charts/cholesterol/intervention', to: "cholesterols#intervention_session"

  post '/charts/cholesterol/intervention/:id/edit', to: "cholesterols#edit_intervention_session"

  resources :cholesterol, controller: 'cholesterols', path: '/charts/cholesterol'

  get '/clean', to: 'cholesterols#clean_session'

end
