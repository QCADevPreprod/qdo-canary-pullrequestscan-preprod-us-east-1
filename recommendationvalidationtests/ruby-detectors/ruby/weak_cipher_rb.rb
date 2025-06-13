require 'openssl'

# {fact rule=cryptographic-key-generator@v1.0 defects=1}

# BAD: creating a cipher using a weak scheme

weak = OpenSSL::Cipher.new('des3')
weak.encrypt
weak.random_key
# {/fact}

# {fact rule=cryptographic-key-generator@v1.0 defects=1}

# BAD: encrypting data using a weak cipher

weak.update('foo')
weak.final
# {/fact}

# {fact rule=cryptographic-key-generator@v1.0 defects=1}

# BAD: creating a cipher using a weak block mode

weak = OpenSSL::Cipher::AES.new(128, 'ecb')
weak.encrypt
weak.random_key
# {/fact}

# {fact rule=cryptographic-key-generator@v1.0 defects=1}

# BAD: encrypting data using a weak block mode

weak.update('foo')
weak.final
# {/fact}

# {fact rule=cryptographic-key-generator@v1.0 defects=0}

# GOOD: creating a cipher using a strong scheme

strong = OpenSSL::Cipher.new('blowfish')
strong.encrypt
strong.random_key
# {/fact}

# {fact rule=cryptographic-key-generator@v1.0 defects=0}

# GOOD: encrypting data using a strong cipher

strong.update('bar')
strong.final
# {/fact}

# {fact rule=cryptographic-key-generator@v1.0 defects=1}

# BAD: weak block mode

OpenSSL::Cipher::AES.new(128, :ecb)
# {/fact}

# {fact rule=cryptographic-key-generator@v1.0 defects=0}

# GOOD: strong encryption algorithm

OpenSSL::Cipher::AES.new(128, 'cbc')
# {/fact}

# {fact rule=cryptographic-key-generator@v1.0 defects=0}

# GOOD: strong encryption algorithm

OpenSSL::Cipher::AES.new('128-cbc')
# {/fact}

# {fact rule=cryptographic-key-generator@v1.0 defects=0}

# GOOD: strong encryption algorithm

OpenSSL::Cipher::AES128.new
# {/fact}

# {fact rule=cryptographic-key-generator@v1.0 defects=1}

# BAD: weak block mode

OpenSSL::Cipher::AES128.new 'ecb'
# {/fact}

# {fact rule=cryptographic-key-generator@v1.0 defects=0}

# GOOD: strong encryption algorithm

OpenSSL::Cipher::AES192.new
# {/fact}

# {fact rule=cryptographic-key-generator@v1.0 defects=1}

# BAD: weak block mode

OpenSSL::Cipher::AES192.new 'ecb'
# {/fact}

# {fact rule=cryptographic-key-generator@v1.0 defects=0}

# GOOD: strong encryption algorithm

OpenSSL::Cipher::AES256.new
# {/fact}

# {fact rule=cryptographic-key-generator@v1.0 defects=1}

# BAD: weak block mode

OpenSSL::Cipher::AES256.new 'ecb'
# {/fact}

# {fact rule=cryptographic-key-generator@v1.0 defects=0}

# GOOD: strong encryption algorithm

OpenSSL::Cipher::BF.new
# {/fact}

# {fact rule=cryptographic-key-generator@v1.0 defects=1}

# BAD: weak block mode

OpenSSL::Cipher::BF.new 'ecb'
# {/fact}

# {fact rule=cryptographic-key-generator@v1.0 defects=0}

# GOOD: strong encryption algorithm

OpenSSL::Cipher::CAST5.new
# {/fact}

# {fact rule=cryptographic-key-generator@v1.0 defects=1}

# BAD: weak block mode

OpenSSL::Cipher::CAST5.new 'ecb'
# {/fact}

# {fact rule=cryptographic-key-generator@v1.0 defects=1}

# BAD: weak encryption algorithm

OpenSSL::Cipher::DES.new
# {/fact}

# {fact rule=cryptographic-key-generator@v1.0 defects=1}

# BAD: weak encryption algorithm


OpenSSL::Cipher::DES.new 'cbc'
# {/fact}

# {fact rule=cryptographic-key-generator@v1.0 defects=0}

# GOOD: strong encryption algorithm

OpenSSL::Cipher::IDEA.new
# {/fact}

# {fact rule=cryptographic-key-generator@v1.0 defects=1}

# BAD: weak block mode

OpenSSL::Cipher::IDEA.new 'ecb'
# {/fact}

# {fact rule=cryptographic-key-generator@v1.0 defects=1}

# BAD: weak encryption algorithm

OpenSSL::Cipher::RC2.new
# {/fact}

# {fact rule=cryptographic-key-generator@v1.0 defects=1}

# BAD: weak encryption algorithm

OpenSSL::Cipher::RC2.new 'ecb'
# {/fact}

# {fact rule=cryptographic-key-generator@v1.0 defects=1}

# BAD: weak encryption algorithm

OpenSSL::Cipher::RC4.new
# {/fact}

# {fact rule=cryptographic-key-generator@v1.0 defects=1}

# BAD: weak encryption algorithm

OpenSSL::Cipher::RC4.new '40'
# {/fact}

# {fact rule=cryptographic-key-generator@v1.0 defects=1}

# BAD: weak encryption algorithm

OpenSSL::Cipher::RC4.new 'hmac-md5'
# {/fact}

