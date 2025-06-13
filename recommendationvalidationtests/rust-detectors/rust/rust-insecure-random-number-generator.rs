let capacity_spec = factory.capacity_spec();

//ruleid: rust-insecure-random-number-generator
let mut rng = StdRng::seed_from_u64(42); 
for _ in 0..10 {
        let random_number: u32 = rng.gen();
}

//ruleid: rust-insecure-random-number-generator
let mut rng = rand::weak_rng();
let mut normal = Normal::new(-2.71828, 3.14159);

//ok: rust-insecure-random-number-generator
let mut rng = rand::thread_rng();
let mut setpoint_settings = Settings::testing_default();

//ok: rust-insecure-random-number-generator
let mut rng = OsRng::new().unwrap();
let random_number: u32 = rng.gen();

//ok: rust-insecure-random-number-generator
let key = ring::aead::LessSafeKey::new(unbound_key);
 let rng = ring::rand::SystemRandom::new();

//ok: rust-insecure-random-number-generator
 let rng = ring::rand::SystemRandom::new();
 self.key.sign(self.encoding, &rng, message, &mut sig);

//ok: rust-insecure-random-number-generator
let mut rng = rand::thread_rng();
let random_number: i32 = rng.gen_range(-100..=100);
