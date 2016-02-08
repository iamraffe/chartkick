# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20160201151402) do

  create_table "charts", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string   "type"
    t.integer  "user_id"
  end

  add_index "charts", ["user_id"], name: "index_charts_on_user_id"

  create_table "entries", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string   "symbol"
    t.integer  "value"
    t.datetime "date"
    t.string   "chart_type"
    t.integer  "user_id"
    t.integer  "chart_id"
  end

  add_index "entries", ["chart_id"], name: "index_entries_on_chart_id"
  add_index "entries", ["user_id"], name: "index_entries_on_user_id"

  create_table "interventions", force: :cascade do |t|
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
    t.string   "title"
    t.datetime "start"
    t.datetime "end"
    t.string   "description"
    t.integer  "index"
    t.string   "type"
    t.integer  "user_id"
    t.integer  "chart_id"
  end

  add_index "interventions", ["chart_id"], name: "index_interventions_on_chart_id"
  add_index "interventions", ["user_id"], name: "index_interventions_on_user_id"

  create_table "users", force: :cascade do |t|
    t.date     "date_of_birth"
    t.string   "name"
    t.string   "email"
    t.string   "gender"
    t.string   "phone_number"
    t.boolean  "diabetes"
    t.boolean  "heart_disease"
    t.datetime "created_at",    null: false
    t.datetime "updated_at",    null: false
  end

end
