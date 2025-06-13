 def test_deserialization
   CSV.load params[:csv]

   Marshal.load params[:object]

   Marshal.restore User.find(1).cool_stored_thing
 end

 def bad_deserialization
   data = request.env[:name]
   # ruleid: bad-deserialization-env
   obj = Marshal.load(data)

   o = Klass.new(request.env[:name])
   data = CSV.dump(o)
   # ruleid: bad-deserialization-env
   obj = CSV.load(data)

   o = Klass.new("hello\n")
   data = request.env[:name]
   # ruleid: bad-deserialization-env
   obj = Oj.object_load(data)
   # ruleid: bad-deserialization-env
   obj = Oj.load(data)
   # ok: bad-deserialization-env
   obj = Oj.load(data,options=some_safe_options)
 end

 def ok_deserialization
    o = Klass.new("hello\n")
    data = CSV.dump(o)
    # ok: bad-deserialization-env
    obj = CSV.load(data)
    
    data = get_safe_data()
    # ok: bad-deserialization-env
    obj = Marshal.load(data)
 end
  
 def handler(event:, context:)
	foobar = event['smth']

    # ruleid: tainted-deserialization
    obj1 = Marshal.load(foobar)

    data = event['body']['object']
    # ruleid: tainted-deserialization
    obj2 = YAML.load(data)

    # ruleid: tainted-deserialization
    obj3 = CSV.load("o:" + event['data'])
 end

 def ok_handler(event:, context:)

    # ok: tainted-deserialization
    obj1 = Marshal.load(Marshal.dump(Foobar.new))

    data = "hardcoded_value"
    # ok: tainted-deserialization
    obj2 = YAML.load(data)

    # ok: tainted-deserialization
    obj3 = CSV.load(get_safe_data())
 end
