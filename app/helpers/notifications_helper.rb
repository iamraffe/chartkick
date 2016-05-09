module NotificationsHelper
  def user_notifications(notifications)
    if notifications.empty?
      list = %Q{<ul class='list-unstyled notifications empty'>
                  <li class='notification row'>
                    <span class='notification-subject'>
                      You have no notifications.
                    </span>
                  </li>
                </ul>}.html_safe
    else
      notification_list(notifications)
    end
  end

  def notification_list(notifications)
    list = %Q{<ul class='list-unstyled'>
                <li class='notification-actions'>
                  <a href='#'>Mark All as Read</a> | <a href='#'>Settings</a> | <a href='#'>See All</a>
                </li>
            }

        notifications.each do |notification|
          list += %Q{<li class='notification row'>
                    <hr>
                    <a href='#{notification.action_url}' class='js-mark-as-read' data-id='#{notification.id}'>
                      <span class='fa fa-bar-chart fa-2x'></span>
                      <span class='notification-subject'>
                        #{notification.subject }
                      </span>
                      <span class='notification-created-at'>
                        #{time_ago_in_words(notification.created_at, include_seconds: true)} ago
                      </span>
                    </a>
                  </li>}
        end
    list += "</ul>"
    list.html_safe
  end
end
