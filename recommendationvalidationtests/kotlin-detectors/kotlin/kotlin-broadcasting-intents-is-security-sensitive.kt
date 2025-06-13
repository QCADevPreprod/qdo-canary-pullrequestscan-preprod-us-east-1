import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.os.Handler
import android.os.UserHandle

public class MyIntentBroadcast {
    fun broadcast(intent: Intent,
                  context: Context,
                  user: UserHandle,
                  resultReceiver: BroadcastReceiver,
                  scheduler: Handler,
                  initialCode: Int,
                  initialData: String,
                  initialExtras: Bundle,
                  broadcastPermission: String) {
        // ruleid: kotlin-broadcasting-intents-is-security-sensitive
        context.sendBroadcast(intent) // Sensitive

        // ruleid: kotlin-broadcasting-intents-is-security-sensitive
        context.sendBroadcastAsUser(intent, user) // Sensitive

        // Broadcasting intent with "null" for receiverPermission
        // ruleid: kotlin-broadcasting-intents-is-security-sensitive
        context.sendBroadcast(intent, null) // Sensitive

        // ruleid: kotlin-broadcasting-intents-is-security-sensitive
        context.sendBroadcastAsUser(intent, user, null) // Sensitive

        // ruleid: kotlin-broadcasting-intents-is-security-sensitive
        context.sendOrderedBroadcast(intent, null) // Sensitive

        // ruleid: kotlin-broadcasting-intents-is-security-sensitive
        context.sendOrderedBroadcastAsUser(intent, user, null, resultReceiver,
            scheduler, initialCode, initialData, initialExtras) // Sensitive


        // ok: kotlin-broadcasting-intents-is-security-sensitive
        context.sendBroadcast(intent, broadcastPermission)

        // ok: kotlin-broadcasting-intents-is-security-sensitive
        context.sendBroadcastAsUser(intent, user, broadcastPermission)

        // ok: kotlin-broadcasting-intents-is-security-sensitive
        context.sendOrderedBroadcast(intent, broadcastPermission)

        // ok: kotlin-broadcasting-intents-is-security-sensitive
        context.sendOrderedBroadcast(null, broadcastPermission)

        // ok: kotlin-broadcasting-intents-is-security-sensitive
        context.sendOrderedBroadcastAsUser(intent, user,             broadcastPermission, resultReceiver,
            scheduler, initialCode, initialData, initialExtras)
    }
          
}