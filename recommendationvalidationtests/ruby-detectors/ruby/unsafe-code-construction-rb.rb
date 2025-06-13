class Foobar
    def foo1(target)
  # {fact rule=autoescape-disabled@v1.0 defects=1}
      # ruleid: unsafe-code-construction-rb
      eval("foo = #{target}") # NOT OK
  
  # {/fact}
    end
  
    # sprintf
    def foo2(x) 
  # {fact rule=autoescape-disabled@v1.0 defects=1}
      # ruleid: unsafe-code-construction-rb
      eval(sprintf("foo = %s", x)) # NOT OK
  
  # {/fact}
    end
  
    # String#%
    def foo3(x)
  # {fact rule=autoescape-disabled@v1.0 defects=1}
      # ruleid: unsafe-code-construction-rb
      eval("foo = %{foo}" % {foo: x}) # NOT OK
  
  # {/fact}
    end   
  
    def indirect_eval(x)
  # {fact rule=autoescape-disabled@v1.0 defects=0}
      # ok: unsafe-code-construction-rb
      eval(x) # OK - no construction.
  
  # {/fact}
    end
  
    def send_stuff(x)
  # {fact rule=autoescape-disabled@v1.0 defects=0}
      # ok: unsafe-code-construction-rb
      foo.send("foo_#{x}") # OK - attacker cannot control entire string.
  
  # {/fact}
    end
  
    def named_code(code)
  # {fact rule=autoescape-disabled@v1.0 defects=0}
      # ok: unsafe-code-construction-rb
      eval("def \n #{code} \n end") # OK - parameter is named code
  
  # {/fact}
    end
  
    def joinStuff(my_arr)
  # {fact rule=autoescape-disabled@v1.0 defects=1}
      # ruleid: unsafe-code-construction-rb
      eval(my_arr.join("\n")) # NOT OK
  
  # {/fact}
    end
  
    def joinWithElemt(x) 
      arr = [x, "foobar"]
  # {fact rule=autoescape-disabled@v1.0 defects=1}
      # ruleid: unsafe-code-construction-rb
      eval(arr.join("\n")) # NOT OK
  
  # {/fact}
    end
  
    def pushArr(x, y)
      arr = []
      arr.push(x)
  # {fact rule=autoescape-disabled@v1.0 defects=1}
      # ruleid: unsafe-code-construction-rb
      eval(arr.join("\n")) # NOT OK
  
  # {/fact}
  
      arr2 = []
      arr2 << y
  # {fact rule=autoescape-disabled@v1.0 defects=1}
      # ruleid: unsafe-code-construction-rb
      eval(arr.join("\n")) # NOT OK
  
  # {/fact}
    end
  
    def hereDoc(x)
      foo = <<~HERE
          #{x}
      HERE
  # {fact rule=autoescape-disabled@v1.0 defects=1}
      # ruleid: unsafe-code-construction-rb
      eval(foo) # NOT OK
  
  # {/fact}
    end
  
    def string_concat(x)
      foo = "foo = " + x
  # {fact rule=autoescape-disabled@v1.0 defects=1}
      # ruleid: unsafe-code-construction-rb
      eval(foo) # NOT OK
  
  # {/fact}
    end
  
    def join_indirect(x, y) 
      arr = Array(x)
  # {fact rule=autoescape-disabled@v1.0 defects=1}
      # ruleid: unsafe-code-construction-rb
      eval(arr.join(" ")) # NOT OK
  
  # {/fact}
  
      arr2 = [Array(["foo = ", y]).join(" ")]
  # {fact rule=autoescape-disabled@v1.0 defects=1}
      # ruleid: unsafe-code-construction-rb
      eval(arr2.join("\n")) # NOT OK
  
  # {/fact}
    end
  end
