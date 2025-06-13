import kotlin.random.Random

class PseudorandomNumber {
    fun noncompliant1() {
        // ruleid: kotlin-pseudorandom-number-generators
        val random = Random() // Noncompliant: Random() is not a secure random number generator
        val bytes = ByteArray(20)
        random.nextBytes(bytes)
    }

    fun noncompliant2() {
        // ruleid: kotlin-pseudorandom-number-generators
        val random = Random()
        val randomInt = random.nextInt()
    }

    fun noncompliant3() {
        // ruleid: kotlin-pseudorandom-number-generators
        val random = Random()
        val randomDouble = random.nextDouble()
    }

    fun noncompliant4() {
        // ruleid: kotlin-pseudorandom-number-generators
        val randomBoolean = Random().nextBoolean()
    }

    fun compliant1() {
        // ok: kotlin-pseudorandom-number-generators
        val random = SecureRandom() // Compliant
        val bytes = ByteArray(20)
        random.nextBytes(bytes)
    }

    fun compliant2() {
        // ok: kotlin-pseudorandom-number-generators
        val secureRandom = SecureRandom()
        val randomInt = secureRandom.nextInt()
    }

    fun compliant3() {
        // ok: kotlin-pseudorandom-number-generators
        val secureRandom = SecureRandom()
        val randomDouble = secureRandom.nextDouble()
    }

    fun compliant4() {
        // ok: kotlin-pseudorandom-number-generators
        val randomBoolean = SecureRandom().nextBoolean()
    }
}
