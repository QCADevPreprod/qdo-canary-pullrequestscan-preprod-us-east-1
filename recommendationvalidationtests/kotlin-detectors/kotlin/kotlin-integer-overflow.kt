import java.security.SecureRandom

class IntegerOverflow {

    fun noncompliant1() {
        val a: Int = Int.MAX_VALUE
        val b: Int = 1
        // ruleid:kotlin-integer-overflow
        val result: Int = a + b // This will cause integer overflow
        println("Result of addition: $result")
    }

    fun noncompliant2() {
        val a: Int = Int.MAX_VALUE / 2
        val b: Int = 3
        // ruleid:kotlin-integer-overflow
        val result: Int = a * b // This will cause integer overflow
        println("Result of multiplication: $result")
    }


    fun noncompliant3() {
        val a: Int = Int.MIN_VALUE
        val b: Int = 1
        // ruleid:kotlin-integer-overflow
        val result: Int = a - b // This will cause integer overflow
        println("Result of subtraction: $result")
    }


    fun noncompliant4() {
        val a: Int = Int.MIN_VALUE
        val b: Int = -1
        // ruleid:kotlin-integer-overflow
        val result: Int = a / b // This will cause integer overflow
        println("Result of division: $result")
    }


    fun noncompliant5() {
        var value: Int = Int.MAX_VALUE
        // ruleid:kotlin-integer-overflow
        value++ // This will cause integer overflow
        println("Incremented value: $value")
    }


    fun noncompliant6() {
        var value: Int = Int.MIN_VALUE
        // ruleid:kotlin-integer-overflow
        value-- // This will cause integer overflow
        println("Decremented value: $value")
    }


    fun noncompliant7(args: Array<String>) {
        run {
            val i = Long.MAX_VALUE
            // BAD: overflow
            // ruleid:kotlin-integer-overflow
            val j = i + 1
        }
    }


    fun noncompliant8(args: Array<String>) {
        run {
            val data = SecureRandom().nextInt()

            // BAD: may overflow if data is large
            // ruleid:kotlin-integer-overflow
            val scaled = data * 10

        }
    }

    fun compliant1() {
        val a: Int = Int.MAX_VALUE
        val b: Int = 1

        // Check for potential integer overflow before performing addition
        // ok:kotlin-integer-overflow
        val result: Int = if (b > 0 && a > Int.MAX_VALUE - b) {
            println("Error: Addition will cause integer overflow")
            0 // Return a default value or handle the error appropriately
        } else {
            a + b
        }

    }

    fun compliant2() {
        val a: Int = Int.MAX_VALUE / 2
        val b: Int = 3

        // Check for potential integer overflow before performing multiplication
        // ok:kotlin-integer-overflow
        val result: Int = if (a > Int.MAX_VALUE / b) {
            println("Error: Multiplication will cause integer overflow")
            0 // Return a default value or handle the error appropriately
        } else {
            a * b
        }

        println("Result of multiplication: $result")
    }


    fun compliant3() {
        val a: Int = Int.MIN_VALUE
        val b: Int = 1

        // Check for potential integer overflow before performing subtraction
        // ok:kotlin-integer-overflow
        val result: Int = if (b > 0 && a < Int.MIN_VALUE + b) {
            println("Error: Subtraction will cause integer overflow")
            0 // Return a default value or handle the error appropriately
        } else {
            a - b
        }

        println("Result of subtraction: $result")
    }


    fun compliant4(): Int {
        val a: Int = Int.MIN_VALUE
        val b: Int = -1

        // Check for potential integer overflow before performing division
        // ok:kotlin-integer-overflow
        return if (b == 0 || (a == Int.MIN_VALUE && b == -1)) {
            println("Error: Division will cause integer overflow")
            0 // Return a default value or handle the error appropriately
        } else {
            a / b
        }
    }


    fun compliant5(): Int {
        var value: Int = Int.MAX_VALUE

        // Check for potential integer overflow before incrementing
        // ok:kotlin-integer-overflow
        return if (value == Int.MAX_VALUE) {
            println("Error: Incrementing value will cause integer overflow")
            value // Return the original value to indicate overflow
        } else {
            value++
            value 
        }
    }


    fun compliant6(): Int {
        var value: Int = Int.MIN_VALUE

        // Check for potential integer overflow before decrementing
        // ok:kotlin-integer-overflow
        return if (value == Int.MIN_VALUE) {
            println("Error: Decrementing value will cause integer overflow")
            value // Return the original value to indicate overflow
        } else {
            value--
            value
        }
    }


    fun compliant7(args: Array<String>) {
        run {
            val i = Int.MAX_VALUE
            // GOOD: no overflow
            // ok:kotlin-integer-overflow
            val j = i.toLong() + 1
        }
    }

    fun compliant8(args: Array<String>) {
        run {
            val data = SecureRandom().nextInt()
            // GOOD: use a guard to ensure no overflows occur
            val scaled: Int
            // ok:kotlin-integer-overflow
            scaled = if (data < Int.MAX_VALUE / 10) data * 10 else Int.MAX_VALUE
        }
    }


}
