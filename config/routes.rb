Rails.application.routes.draw do
  root to: 'pages#index'
  # root to: 'charts#index'
  get 'charts', to: 'charts#index', as: 'chart_index'

  resources :cholesterol, controller: 'cholesterols', path: '/charts/cholesterol'

end
