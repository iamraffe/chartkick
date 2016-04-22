module UsersHelper
  def age(dob, today=nil)
    return "No date of birth" if dob.nil?
    today ||= Date.current

    month_diff = (12 * today.year + today.month) - (12 * dob.year + dob.month)
    y, m = month_diff.divmod 12

    y_text =      (y == 0) ? nil : (y == 1) ? '1 year'  : "#{y} years"
    m_text = y && (m == 0) ? nil : (m == 1) ? '1 month' : "#{m} months"
    # [y_text, m_text].compact.join(' and ') + ' old'
    y_text + ' old'
  end

  def salutation(user)
    if user.is_physician?
      "Dr. #{user.last_name}"
    else
      user.full_name
    end
  end

  def user_prominant_role(user)
    if user.is_physician?
      " - Doctor"
    elsif user.has_role?(:nurse)
      " - Nurse"
    else
      ""
    end
  end
end
