import android.content.BroadcastReceiver
import android.content.Context
import android.content.IntentFilter
import android.os.Build
import android.os.Handler
import androidx.annotation.RequiresApi

class MyIntentReceiver {
    @RequiresApi(api = Build.VERSION_CODES.O)
    fun register_unsafe1(
        context: Context, receiver: BroadcastReceiver?,
        filter: IntentFilter?,
        scheduler: Handler?,
        flags: Int
    ) {
        // ruleid: kotlin-receiving-intents-is-security-sensitive
        context.registerReceiver(receiver, filter) // Sensitive

        // ruleid: kotlin-receiving-intents-is-security-sensitive
        context.registerReceiver(receiver, filter, flags) // Sensitive

    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    fun register_unsafe2(
        context: Context, receiver: BroadcastReceiver?,
        filter: IntentFilter?,
        scheduler: Handler?,
        flags: Int
    ) {

        // Broadcasting intent with "null" for broadcastPermission
        // ruleid: kotlin-receiving-intents-is-security-sensitive
        context.registerReceiver(receiver, filter, null, scheduler) // Sensitive
        // ruleid: kotlin-receiving-intents-is-security-sensitive
        context.registerReceiver(receiver, filter, null, scheduler, flags) // Sensitive
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    fun register_safe1(
        context: Context, receiver: BroadcastReceiver?,
        filter: IntentFilter?,
        broadcastPermission: String?,
        scheduler: Handler?,
        flags: Int
    ) {
        // ok: kotlin-receiving-intents-is-security-sensitive
        context.registerReceiver(receiver, filter, broadcastPermission, scheduler)
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    fun register_safe2(
        context: Context, receiver: BroadcastReceiver?,
        filter: IntentFilter?,
        broadcastPermission: String?,
        scheduler: Handler?,
        flags: Int
    ) {
        // ok: kotlin-receiving-intents-is-security-sensitive
        context.registerReceiver(receiver, filter, broadcastPermission, scheduler, flags)

        // ok: kotlin-receiving-intents-is-security-sensitive
        val batteryStatus = context.registerReceiver(null, IntentFilter(Intent.ACTION_BATTERY_CHANGED))

        // ok: kotlin-receiving-intents-is-security-sensitive
        val batteryStatus = context.registerReceiver(null, iFilter)
    }
}