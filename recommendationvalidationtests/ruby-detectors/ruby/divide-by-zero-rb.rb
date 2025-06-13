def divide_by_zero
  # ruleid: divide-by-zero
  3/0
  # ruleid: divide-by-zero
  oops = 4/0
  variable = 3
  # ruleid: divide-by-zero
  oops = variable / 0

  zero = 0
  # ruleid: divide-by-zero
  bad = variable/zero



  # ok: divide-by-zero
  if zero != 0
    variable / zero
  end

  if variable > 4
    # ruleid: divide-by-zero
    variable / zero
  end

  # ok: divide-by-zero
  begin
    ok4 =  variable / zero
  rescue
  else
    ok4 = 5
  end

  # ok: divide-by-zero
  ok = 1.0 / 0
  # ok: divide-by-zero
  ok2 = 2.0 / zero
  # ok: divide-by-zero
  ok3 = variable / 2;

end