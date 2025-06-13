import android.content.Context

class AccessExternal{

    fun accessFiles(context : Context) {
    //ruleid: kotlin-accessing-android-external-storage
        context.getExternalFilesDir(null)
    }

    fun accessFiles(context : Context) {
    //ruleid: kotlin-accessing-android-external-storage
        context.getExternalFilesDir("filepath")
    }
    
    fun accessFiles(context : ContextOther) {
    //ok: kotlin-accessing-android-external-storage
        context.getExternalFilesDir(null)
    }

    fun accessF2(context : Context) {
    //ok: kotlin-accessing-android-external-storage
          context.getFilesDir()
    }
}