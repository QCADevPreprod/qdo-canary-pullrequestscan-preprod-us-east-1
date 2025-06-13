require "fileutils"

def run_chmod_1(filename)
  # {fact rule=insecure-file-permissions@v1.0 defects=1}

  # BAD: sets file as world writable

  FileUtils.chmod 0222, filename
  # {/fact}

  # {fact rule=insecure-file-permissions@v1.0 defects=1}

  # BAD: sets file as world writable

  FileUtils.chmod 0622, filename
  # {/fact}

  # {fact rule=insecure-file-permissions@v1.0 defects=1}

  # BAD: sets file as world readable

  FileUtils.chmod 0755, filename
  # {/fact}

  # {fact rule=insecure-file-permissions@v1.0 defects=1}

  # BAD: sets file as world readable + writable

  FileUtils.chmod 0777, filename
end
# {/fact}

module DummyModule
  def chmod(mode, list, options = {} )
    list
  end
end

def run_chmod_2(filename)
  foo = File
  bar = foo
  baz = DummyModule
  # {fact rule=insecure-file-permissions@v1.0 defects=0}

  # GOOD: DummyModule is not a known class that performs file permission modifications


  baz.chmod 0755, filename
  baz = bar
  # {/fact}

  # {fact rule=insecure-file-permissions@v1.0 defects=1}

  # BAD: sets file as world readable

  baz.chmod 0755, filename
end
# {/fact}

def run_chmod_3(filename)
  # TODO: we currently miss this
  foo = FileUtils
  bar, baz = foo, 7
  # {fact rule=insecure-file-permissions@v1.0 defects=1}

  # BAD: sets file as world readable

  bar.chmod 0755, filename
end
# {/fact}
def run_chmod_4(filename)
  # {fact rule=insecure-file-permissions@v1.0 defects=0}

  # GOOD: no group/world access

  FileUtils.chmod 0700, filename
  # {/fact}

  # {fact rule=insecure-file-permissions@v1.0 defects=0}

  # GOOD: group/world execute bit only

  FileUtils.chmod 0711, filename
  # {/fact}

  # {fact rule=insecure-file-permissions@v1.0 defects=0}

  # GOOD: world execute bit only

  FileUtils.chmod 0701, filename

  # {/fact}

  # {fact rule=insecure-file-permissions@v1.0 defects=0}

  # GOOD: group execute bit only

  FileUtils.chmod 0710, filename
end
# {/fact}

def run_chmod_5(filename)
  perm = 0777
  # {fact rule=insecure-file-permissions@v1.0 defects=1}

  # BAD: sets world rwx

  FileUtils.chmod perm, filename
  perm2 = perm

  # {/fact}

  # {fact rule=insecure-file-permissions@v1.0 defects=1}

  # BAD: sets world rwx

  FileUtils.chmod perm2, filename

  perm = "u=wrx,g=rwx,o=x"
  perm2 = perm
  # {/fact}

  # {fact rule=insecure-file-permissions@v1.0 defects=1}

  # BAD: sets group rwx
  FileUtils.chmod perm2, filename

  # {/fact}

  # {fact rule=insecure-file-permissions@v1.0 defects=1}

  # BAD: sets file as world readable

  FileUtils.chmod "u=rwx,o+r", filename

  # {/fact}

  # {fact rule=insecure-file-permissions@v1.0 defects=0}

  # GOOD: sets file as group/world unreadable

  FileUtils.chmod "u=rwx,go-r", filename
  # {/fact}

  # {fact rule=insecure-file-permissions@v1.0 defects=1}

  # BAD: sets group/world as +rw

  FileUtils.chmod "a+rw", filename
end
# {/fact}
def run_chmod_R(filename)
  # {fact rule=insecure-file-permissions@v1.0 defects=1}

  # BAD: sets file as world readable

  FileUtils.chmod_R 0755, filename
end
# {/fact}