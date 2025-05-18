import bcrypt from 'bcrypt';

const input = process.argv[2];

if (!input) {
  console.log("Usage: node bcrypt_encode.js <string_to_encode>");
  process.exit(1);
}

const saltRounds = 1;

bcrypt.hash(input, saltRounds, function(err, hash) {
  if (err) {
    console.error("Error hashing:", err);
    process.exit(1);
  }
  console.log("Hashed password:", hash);
});
