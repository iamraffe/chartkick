Rails.application.routes.draw do
  root to: 'charts#index'

    resources :cholesterol, controller: 'cholesterols', path: '/charts/cholesterol'

end
