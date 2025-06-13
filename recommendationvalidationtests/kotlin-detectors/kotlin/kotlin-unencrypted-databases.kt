class UnencryptedDB {

  fun noncompliant1() {
    // ruleid: kotlin-unencrypted-databases
    var db = activity.openOrCreateDatabase("test.db", Context.MODE_PRIVATE, null) // Sensitive
  }

  fun noncompliant2() {
    // ruleid: kotlin-unencrypted-databases
    val pref = activity.getPreferences(Context.MODE_PRIVATE) // Sensitive
  }

  fun noncompliant3() {
    val config = RealmConfiguration.Builder().build()
    // ruleid: kotlin-unencrypted-databases
    val realm = Realm.getInstance(config) // Sensitive
  }

  fun compliant1() {
    // ok: kotlin-unencrypted-databases
    val db = SQLiteDatabase.openOrCreateDatabase("test.db", getKey(), null)
  }

  fun compliant2() {
    // ok: kotlin-unencrypted-databases
    val masterKeyAlias = MasterKeys.getOrCreate(MasterKeys.AES256_GCM_SPEC)
    EncryptedSharedPreferences.create(
        "secret",
        masterKeyAlias,
        context,
        EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
        EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
    )
  }

  fun compliant3() {
    val config = RealmConfiguration.Builder()
        .encryptionKey(getKey())
        .build()
    // ok: kotlin-unencrypted-databases
    val realm = Realm.getInstance(config)
  }

}
