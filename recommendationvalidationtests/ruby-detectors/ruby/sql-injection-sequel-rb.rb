require 'jwt'
require 'json'
require 'mysql2'
require 'sequel'

def handler(event:, context:)
  DB = Sequel.connect(
    :adapter  => 'mysql2',
    :host     => ENV["DB_HOST"],
    :port     => ENV["DB_PORT"],
    :database => ENV["DB_NAME"],
    :user     => ENV["DB_USER"],
    :password => ENV["DB_PASSWORD"])
  # {fact rule=cross-site-scripting@v1.0 defects=1}

  # ruleid: sequel-sqli
  dataset = DB["SELECT * FROM users WHERE group='#{event['id']}'"]
  # {/fact}
  # {fact rule=cross-site-scripting@v1.0 defects=0}

  # ok: sequel-sqli
  dataset2 = DB['select id from items']
  # {/fact}

  {statusCode: 200, body: JSON.generate(dataset)}
end