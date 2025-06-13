class FooController < ActionController::Base
# {fact rule=client-constructor-deprecated-rule@v1.0 defects=1}

  # BAD


  def route0
    path = params[:path]
    @content = File.read path
  end
# {/fact}

# {fact rule=client-constructor-deprecated-rule@v1.0 defects=1}

  # BAD - File.absolute_path preserves taint


  def route1
    path = File.absolute_path params[:path]
    @content = File.read path
  end
# {/fact}

# {fact rule=client-constructor-deprecated-rule@v1.0 defects=1}

  # BAD - File.dirname preserves taint


  def route2
    path = "#{File.dirname(params[:path])}/foo"
    @content = File.read path
  end
# {/fact}

# {fact rule=client-constructor-deprecated-rule@v1.0 defects=1}

  # BAD - File.expand_path preserves taint


  def route3
    path = File.expand_path params[:path]
    @content = File.read path
  end
# {/fact}

# {fact rule=client-constructor-deprecated-rule@v1.0 defects=1}

  # BAD - File.path preserves taint


  def route4
    path = File.path params[:path]
    @content = File.read path
  end
# {/fact}

# {fact rule=client-constructor-deprecated-rule@v1.0 defects=1}

  # BAD - File.realdirpath preserves taint


  def route5
    path = File.realdirpath params[:path]
    @content = File.read path
  end
# {/fact}

# {fact rule=client-constructor-deprecated-rule@v1.0 defects=1}

  # BAD - File.realpath preserves taint


  def route6
    path = File.realpath params[:path]
    @content = File.read path
  end
# {/fact}

# {fact rule=client-constructor-deprecated-rule@v1.0 defects=1}

  # BAD - tainted arguments in any position propagate to the return value of


  # File.join
  def route7
    path = File.join("foo", "bar", "baz", params[:path], "qux")
    @content = File.read path
  end
# {/fact}

# {fact rule=client-constructor-deprecated-rule@v1.0 defects=0}

  # GOOD - File.basename does not preserve taint


  def route8
    path = File.basename params[:path]
    @content = File.read path
  end
# {/fact}

  def route8v2
    dummy = params[:path]
    path = File.basename dummy
    @content = File.read path
  end
# {/fact}


# {fact rule=client-constructor-deprecated-rule@v1.0 defects=1}

  # BAD

  def route9
    path = ActiveStorage::Filename.new(params[:path])
    @content = File.read path
  end
# {/fact}

# {fact rule=client-constructor-deprecated-rule@v1.0 defects=0}

  # GOOD - explicitly sanitized

  def route10
    path = ActiveStorage::Filename.new(params[:path]).sanitized
    @content = File.read path
  end
# {/fact}

# {fact rule=client-constructor-deprecated-rule@v1.0 defects=1}

  # BAD

  def route11
    path = ActiveStorage::Filename.new(params[:path])
    send_file path
  end
# {/fact}

# {fact rule=client-constructor-deprecated-rule@v1.0 defects=1}

  # BAD

  def route12
    path = ActiveStorage::Filename.new(params[:path])
    bla (Dir.glob path)
    bla (Dir[path])
  end
# {/fact}

# {fact rule=client-constructor-deprecated-rule@v1.0 defects=1}

  # BAD

  def route13
    path = ActiveStorage::Filename.new(params[:path])
    load(path)
    autoload(:MyModule, path)
  end

  def require_relative()
    path = ActiveStorage::Filename.new(params[:path])
    puts "Debug: require_relative(#{path})"
    super(path)
  end
end
# {/fact}
