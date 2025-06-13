require 'pg'

def show(event:, context:)
  conn = PG::Connection.open(:dbname => 'test')
  # {fact rule=cross-site-scripting@v1.0 defects=0}

  # ok: pg-sqli
  res = conn.exec_params('SELECT $1 AS a, $2 AS b, $3 AS c', [event['id'], 2, nil])
  # {/fact}
  # {fact rule=cross-site-scripting@v1.0 defects=1}

  # ruleid: pg-sqli
  res2 = conn.exec_params('SELECT * FROM foobar WHERE id = %{id}' % {id: event['id']})
  # {/fact}

  {
    body: res2
  }
  res2 = conn.exec_params params[:test]

end