class UsersController < ActionController::Base

  def show
# {fact rule=untrusted-format-strings@v1.0 defects=1}
    printf(params[:format], arg) # BAD

# {/fact}
# {fact rule=untrusted-format-strings@v1.0 defects=1}
    Kernel.printf(params[:format], arg) # BAD

# {/fact}

# {fact rule=untrusted-format-strings@v1.0 defects=0}
    printf(params[:format]) # GOOD

# {/fact}
# {fact rule=untrusted-format-strings@v1.0 defects=0}
    Kernel.printf(params[:format]) # GOOD

# {/fact}

# {fact rule=untrusted-format-strings@v1.0 defects=1}
printf(IO.new(1), params[:format], arg) # BAD

# {/fact}
# {fact rule=untrusted-format-strings@v1.0 defects=1}
Kernel.printf(IO.new(1), params[:format], arg) # BAD

# {/fact}

# {fact rule=untrusted-format-strings@v1.0 defects=0}
    printf("%s", params[:format]) # GOOD

# {/fact}
# {fact rule=untrusted-format-strings@v1.0 defects=0}
    Kernel.printf("%s", params[:format]) # GOOD

# {/fact}
    fmt = "%s"
# {fact rule=untrusted-format-strings@v1.0 defects=0}
    printf(fmt, params[:format]) # GOOD

# {/fact}

# {fact rule=untrusted-format-strings@v1.0 defects=0}
    printf(IO.new(1), params[:format]) # GOOD [FALSE POSITIVE]

# {/fact}
# {fact rule=untrusted-format-strings@v1.0 defects=0}
    Kernel.printf(IO.new(1), params[:format]) # GOOD [FALSE POSITIVE]

# {/fact}

# {fact rule=untrusted-format-strings@v1.0 defects=1}
str1 = Kernel.sprintf(params[:format], arg) # BAD

# {/fact}
# {fact rule=untrusted-format-strings@v1.0 defects=1}
str2 = sprintf(params[:format], arg) # BAD

# {/fact}

# {fact rule=untrusted-format-strings@v1.0 defects=0}
    str1 = Kernel.sprintf(params[:format]) # GOOD

# {/fact}
# {fact rule=untrusted-format-strings@v1.0 defects=0}
    str2 = sprintf(params[:format]) # GOOD

# {/fact}

    stdout = IO.new 1
# {fact rule=untrusted-format-strings@v1.0 defects=1}
stdout.printf(params[:format], arg) # BAD

# {/fact}

# {fact rule=untrusted-format-strings@v1.0 defects=0}
    stdout.printf(params[:format]) # GOOD

# {/fact}

    # Taint via string concatenation
# {fact rule=untrusted-format-strings@v1.0 defects=1}
    printf("A log message: " + params[:format], arg) # BAD

# {/fact}

    # Taint via string interpolation
# {fact rule=untrusted-format-strings@v1.0 defects=1}
printf("A log message: #{params[:format]}", arg) # BAD

# {/fact}

    # Using String#
# {fact rule=untrusted-format-strings@v1.0 defects=1}
"A log message #{params[:format]} %{foo}" % {foo: "foo"} # BAD

# {/fact}

    # String# with an array
# {fact rule=untrusted-format-strings@v1.0 defects=1}
"A log message #{params[:format]} %08x" % ["foo"] # BAD

# {/fact}
  end
end