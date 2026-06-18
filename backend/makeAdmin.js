const mongoose = require('mongoose');
const userModel = require('./models/userModel');
require('dotenv').config();

async function makeAdmin() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/mern';
    await mongoose.connect(mongoUri);
    
    const email = process.argv[2];
    if (!email) {
      console.log("Molimo navedite email adresu kao argument. Primer: node makeAdmin.js test@example.com");
      console.log("\nRegistrovani korisnici u bazi:");
      const users = await userModel.find({}, 'name email role');
      if (users.length === 0) {
        console.log("Nema registrovanih korisnika u bazi.");
      } else {
        console.table(users.map(u => ({ Ime: u.name, Email: u.email, Uloga: u.role })));
      }
      await mongoose.disconnect();
      process.exit(0);
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      console.log(`Korisnik sa email adresom ${email} nije pronađen.`);
      await mongoose.disconnect();
      process.exit(1);
    }

    user.role = 'ADMIN';
    await user.save();
    console.log(`Korisnik ${user.name} (${email}) je uspešno unapređen u ulogu: ADMIN!`);
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Greška:', error);
    process.exit(1);
  }
}

makeAdmin();
