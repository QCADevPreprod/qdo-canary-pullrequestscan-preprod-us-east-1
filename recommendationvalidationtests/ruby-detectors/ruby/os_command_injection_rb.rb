require "shellwords"
require "open3"

class UsersController < ActionController::Base
    def create
        cmd = params[:cmd]
        `#{cmd}`
        system(cmd)
# {fact rule=os-command-injection@v1.0 defects=0}

        system("echo", cmd) # OK, because cmd is not shell interpreted

        exec(cmd)
        %x(echo #{cmd})
        result = <<`EOF`
        #{cmd}
EOF

        safe_cmd_1 = Shellwords.escape(cmd)
        `echo #{safe_cmd_1}`

        safe_cmd_2 = Shellwords.shellescape(cmd)
        `echo #{safe_cmd_2}`

        if cmd == "some constant"
            `echo #{cmd}`
        end

        if %w(foo bar).include? cmd
            `echo #{cmd}`
        else
            `echo #{cmd}`
        end
# {/fact}
        # Open3 methods
        Open3.capture2("echo #{cmd}")
        Open3.pipeline("cat foo.txt", "grep #{cmd}")
# {fact rule=os-command-injection@v1.0 defects=0}

        Open3.pipeline(["echo", cmd], "tail") # OK, because cmd is not shell interpreted


    end

    def show
        `ls`
        system("ls")
        exec("ls")
        %x(ls)
    end

    def index
        cmd = params[:key]
        if %w(foo bar).include? cmd
            `echo #{cmd}`
        end
        Open3.capture2("echo #{cmd}")
    end

    def update
      cmd = params[:key]
      case cmd
      when "foo"
        system(cmd)
      end
      system(cmd)
    end
# {/fact}
end

module Types
  class BaseObject < GraphQL::Schema::Object; end
  class QueryType < BaseObject
    field :test_field, String, null: false,
      description: "An example field added by the generator",
      resolver: Resolvers::DummyResolver

    field :with_arg, String, null: false, description: "A field with an argument" do
      argument :number, Int, "A number", required: true
    end
    def with_arg(number:)
      system("echo #{number}")
      number.to_s
    end

    field :with_method, String, null: false, description: "A field with a custom resolver method", resolver_method: :custom_method do
      argument :blah_number, Int, "A number", required: true
    end
    def custom_method(blah_number:, number: nil)
      system("echo #{blah_number}")
# {fact rule=os-command-injection@v1.0 defects=0}

      system("echo #{number}") # OK, number: is not an `argument` for this field

# {/fact}
      blah_number.to_s
    end

    field :with_splat, String, null: false, description: "A field with a double-splatted argument" do
      argument :something, Int, "A number", required: true
    end
    def with_splat(**args)
      system("echo #{args[:something]}")
      args[:something].to_s
    end

    def foo(arg)
# {fact rule=os-command-injection@v1.0 defects=0}

      system("echo #{arg}") # OK, this is just a random method, not a resolver method

# {/fact}
    end
  end
end

class Foo < ActionController::Base
    def create
        file = params[:file]
        system("cat #{file}")
        # .shellescape
# {fact rule=os-command-injection@v1.0 defects=0}

        system("cat #{file.shellescape}") # OK, because file is shell escaped

# {/fact}

    end
end

class Foobar
  def foo1(target)
# {fact rule=os-command-injection@v1.0 defects=1}

    IO.popen("cat #{target}", "w") # NOT OK

# {/fact}
  end

  def foo2(x)
# {fact rule=os-command-injection@v1.0 defects=1}

    format = sprintf("cat %s", x) # NOT OK

# {/fact}
    IO.popen(format, "w")
  end

  def fileRead1(path)
# {fact rule=os-command-injection@v1.0 defects=0}

    File.read(path) # OK

# {/fact}
  end

  def my_exec(cmd, command, myCmd, myCommand, innocent_file_path)
# {fact rule=os-command-injection@v1.0 defects=0}

    IO.popen("which #{cmd}", "w") # OK - the parameter is named `cmd`, so it's meant to be a command

# {/fact}
# {fact rule=os-command-injection@v1.0 defects=0}

    IO.popen("which #{command}", "w") # OK - the parameter is named `command`, so it's meant to be a command

# {/fact}
# {fact rule=os-command-injection@v1.0 defects=0}

    IO.popen("which #{myCmd}", "w") # OK - the parameter is named `myCmd`, so it's meant to be a command

# {/fact}
# {fact rule=os-command-injection@v1.0 defects=0}

    IO.popen("which #{myCommand}", "w") # OK - the parameter is named `myCommand`, so it's meant to be a command

# {/fact}
# {fact rule=os-command-injection@v1.0 defects=1}

    IO.popen("which #{innocent_file_path}", "w") # NOT OK - the parameter is named `innocent_file_path`, so it's not meant to be a command

# {/fact}
  end

  def escaped(file_path)
# {fact rule=os-command-injection@v1.0 defects=0}

    IO.popen("cat #{file_path.shellescape}", "w") # OK - the parameter is escaped

# {/fact}

# {fact rule=os-command-injection@v1.0 defects=1}

    IO.popen("cat #{file_path}", "w") # NOT OK - the parameter is not escaped

# {/fact}
  end
end

require File.join(File.dirname(__FILE__), 'sub', 'other')

class Foobar2
  def foo1(target)
# {fact rule=os-command-injection@v1.0 defects=1}

    IO.popen("cat #{target}", "w") # NOT OK

# {/fact}
  end

  def id(x)
# {fact rule=os-command-injection@v1.0 defects=1}

    IO.popen("cat #{x}", "w") # NOT OK - the parameter is not a constant.

# {/fact}
    return x
  end

  def thisIsSafe()
# {fact rule=os-command-injection@v1.0 defects=0}

    IO.popen("echo #{id('foo')}", "w") # OK - only using constants.

# {/fact}
  end

  # class methods
  def self.foo(target)
# {fact rule=os-command-injection@v1.0 defects=1}

    IO.popen("cat #{target}", "w") # NOT OK

# {/fact}
  end

  def arrayJoin(x)
# {fact rule=os-command-injection@v1.0 defects=1}

    IO.popen(x.join(' '), "w") # NOT OK

# {/fact}

# {fact rule=os-command-injection@v1.0 defects=1}

    IO.popen(["foo", "bar", x].join(' '), "w") # NOT OK

# {/fact}
  end

  def string_concat(x)
# {fact rule=os-command-injection@v1.0 defects=1}

    IO.popen("cat " + x, "w") # NOT OK

# {/fact}
  end

  def array_taint (x, y)
    arr = ["cat"]
    arr.push(x)
# {fact rule=os-command-injection@v1.0 defects=1}

    IO.popen(arr.join(' '), "w") # NOT OK

# {/fact}

    arr2 = ["cat"]
    arr2 << y
# {fact rule=os-command-injection@v1.0 defects=1}

    IO.popen(arr.join(' '), "w") # NOT OK

# {/fact}
  end
end