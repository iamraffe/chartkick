class Chart < ActiveRecord::Base
  belongs_to :user
  has_and_belongs_to_many :entries
  has_and_belongs_to_many :interventions

  attr_writer :current_step
  validates :user_id, presence: true, :if => lambda { |o| o.current_step == "naming" }

  def current_step
    @current_step || steps.first
  end

  def steps
    %w[naming adding customizing confirmation]
  end

  def next_step
    self.current_step = steps[steps.index(current_step)+1]
  end

  def previous_step
    self.current_step = steps[steps.index(current_step)-1]
  end

  def first_step?
    current_step == steps.first
  end

  def last_step?
    current_step == steps.last
  end

  def all_valid?
    steps.all? do |step|
      self.current_step = step
      valid?
    end
  end

  def keys
      self.class.keys
  end

  def data
    all_entries = self.entries.map { |e| e.decode!.symbolize_keys }
    all_interventions = self.interventions.map{|i| i.decode!.symbolize_keys }
    {entries: all_entries, interventions: all_interventions}
  end

  def export(blob)
    chart = Magick::Image.from_blob(blob) {
      self.format = 'SVG'
      self.background_color = 'transparent'
    }
    chart.first.format = 'PNG'
    Base64.encode64(chart.first.to_blob)
  end
end
