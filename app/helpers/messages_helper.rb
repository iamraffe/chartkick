module MessagesHelper
  def user_messages(messages)
    if messages.empty?
      list = %Q{<ul class='list-unstyled messages empty'>
                  <li class='message row'>
                    <span class='message-subject'>
                      You have no messages.
                    </span>
                  </li>
                </ul>}.html_safe
    else
      message_list(messages)
    end
  end

  def message_list(messages)
    list = %Q{<ul class='list-unstyled'>
                <li class='message-actions'>
                  <a href='#'>Mark All as Read</a> | <a href='#'>New Message</a> | <a href='#'>See All</a>
                </li>
            }

        messages.each do |message|
          list += %Q{<li class='message row'>
                    <hr>
                    <span class='fa fa-bar-chart fa-2x'></span>
                    <span class='message-subject'>
                      #{message.subject }
                    </span>
                    <span class='message-created-at'>
                      #{time_ago_in_words(message.created_at, include_seconds: true)} ago
                    </span>
                  </li>}
        end
    list += "</ul>"
    list.html_safe
  end
end
