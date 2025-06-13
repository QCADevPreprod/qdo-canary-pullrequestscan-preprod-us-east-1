class NullPointerDerefrence {

    fun noncompliant1() {
        val nullableString: String? = null
        // ruleid:kotlin-null-pointer-dereference
        val length = nullableString.length // Null pointer dereference here 
    }

    fun noncompliant2() {
        val ptr: Int? = null
        // ruleid:kotlin-null-pointer-dereference
        val value = ptr!! 
    }

    fun noncompliant3() {
        val byteBuffer = ByteBuffer.allocateDirect(Int.SIZE_BYTES)
        val ptr = byteBuffer.asIntBuffer()

        byteBuffer.clear()

        // Dereferencing freed pointer
        // ruleid:kotlin-null-pointer-dereference
        val value = ptr[0] 

    }

    fun noncompliant4() {
        val ptr: Int? = null
        // Using NULL pointer in arithmetic operation
        // ruleid:kotlin-null-pointer-dereference
        val result = 5 + ptr!!
    }

    fun noncompliant5() {
        val arr: IntArray? = null
        // ruleid:kotlin-null-pointer-dereference
        val element = arr!![0] 
    }

    fun compliant1() {
        val nullableString: String? = null
        // ok:kotlin-null-pointer-dereference
        val length = nullableString?.length ?: 0
    }

    fun compliant2() {
        val ptr: Int? = null
        // ok:kotlin-null-pointer-dereference
        if(ptr != null) {
            val value = ptr!! 
        }    
    }

    fun compliant3() {
        val byteBuffer = ByteBuffer.allocateDirect(Int.SIZE_BYTES)
        val ptr = byteBuffer.asIntBuffer()

        // ok:kotlin-null-pointer-dereference
        if(ptr != null) {
            val value = ptr[0] 
            byteBuffer.clear()
        }

    }

    fun compliant4() {
        val ptr: Int? = null
        // ok:kotlin-null-pointer-dereference
        if (ptr != null) {
            val result = 5 + ptr!!
        }
    }

    fun compliant5() {
        val arr: IntArray? = null

        // ok:kotlin-null-pointer-dereference
        if (arr != null) {
            val element = arr!![0] 
        }
    }

}
