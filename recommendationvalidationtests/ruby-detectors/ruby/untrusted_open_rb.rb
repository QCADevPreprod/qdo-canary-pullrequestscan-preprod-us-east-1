# ok:dangerous-open
cmd = open("|date")
print cmd.gets
cmd.close

# {fact rule=autoescape-disabled@v1.0 defects=0}
filename = "testfile"
# ok:dangerous-open
open(filename) do |f|
# {/fact}
  print f.gets
end
# {fact rule=autoescape-disabled@v1.0 defects=1}

# ruleid:dangerous-open
cmd = open("|%s" % user_input)
# {/fact}
print cmd.gets
cmd.close
# {fact rule=autoescape-disabled@v1.0 defects=1}

# ruleid:dangerous-open
cmd = open(Kernel::sprintf("|%s", user_input))
# {/fact}
print cmd.gets
cmd.close
