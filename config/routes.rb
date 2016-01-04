Rails.application.routes.draw do
  root to: 'pages#index'

  get 'charts', to: 'charts#index', as: 'chart_index'

  resources :cholesterol, controller: 'cholesterols', path: '/charts/cholesterol'

end
