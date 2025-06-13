require 'logger'

class UsersController < ApplicationController
  include ERB::Util

  def init_logger
    if @logger == nil
      @logger = Logger.new STDOUT
    end
  end

  def read_from_params
    init_logger

    unsanitized = params[:foo]
# {fact rule=ldap-injection@v1.0 defects=1}

    @logger.debug unsanitized             # BAD: unsanitized user input

# {/fact}
# {fact rule=ldap-injection@v1.0 defects=1}

    @logger.error "input: " + unsanitized # BAD: unsanitized user input

# {/fact}

    sanitized = unsanitized.gsub("\n", "")
# {fact rule=ldap-injection@v1.0 defects=0}

    @logger.fatal sanitized            # GOOD: sanitized user input

# {/fact}
# {fact rule=ldap-injection@v1.0 defects=0}

    @logger.warn "input: " + sanitized # GOOD: sanitized user input

# {/fact}

    unsanitized2 = unsanitized.sub("\n", "")
    @logger.info do
# {fact rule=ldap-injection@v1.0 defects=1}

      unsanitized2                      # BAD: partially sanitized user input

# {/fact}
    end
# {fact rule=ldap-injection@v1.0 defects=1}

    @logger << "input: " + unsanitized2 # BAD: partially sanitized user input

# {/fact}
  end

  def read_from_cookies
    init_logger

    unsanitized = cookies[:bar]
# {fact rule=ldap-injection@v1.0 defects=1}

    @logger.add(Logger::INFO) { unsanitized }             # BAD: unsanitized user input

# {/fact}
# {fact rule=ldap-injection@v1.0 defects=1}

    @logger.log(Logger::WARN) { "input: " + unsanitized } # BAD: unsanitized user input

# {/fact}
  end

  def html_sanitization
    init_logger

    sanitized = html_escape params[:baz]
# {fact rule=ldap-injection@v1.0 defects=0}

    @logger.debug sanitized             # GOOD: sanitized user input

# {/fact}
# {fact rule=ldap-injection@v1.0 defects=0}

    @logger.debug "input: " + sanitized # GOOD: sanitized user input

# {/fact}
  end

  def inspect_sanitization
    init_logger

# {fact rule=ldap-injection@v1.0 defects=1}

    @logger.debug params[:foo]         # BAD: unsanitized user input

# {/fact}
# {fact rule=ldap-injection@v1.0 defects=0}

    @logger.debug params[:foo].inspect # GOOD: sanitized user input

# {/fact}
  end
end
