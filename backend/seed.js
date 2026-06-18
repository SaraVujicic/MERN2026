const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Import the product model
const productModel = require('./models/productModel');

// Function to connect to the database and seed the data
async function seedDatabase() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/mern';
    console.log('Connecting to MongoDB at:', mongoUri);
    
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB successfully!');

    // Read the products from products.json
    const productsPath = path.join(__dirname, 'products.json');
    if (!fs.existsSync(productsPath)) {
      throw new Error(`products.json not found at ${productsPath}`);
    }
    
    const rawData = fs.readFileSync(productsPath, 'utf8');
    const productsData = JSON.parse(rawData);

    // Delete existing products
    console.log('Clearing existing products...');
    await productModel.deleteMany({});
    console.log('Database collection cleared.');

    // Map and insert the new products
    const seededProducts = productsData.map((item) => {
      // Calculate a slightly higher original price to show a discount
      const originalPrice = Math.round(item.price * 1.2);
      
      return {
        productName: item.name,
        brandName: 'Sara Fashion',
        category: item.category,
        productImage: [item.image],
        description: item.description,
        price: originalPrice, // Original price (crossed out in UI)
        sellingPrice: item.price // Actual selling price
      };
    });

    console.log(`Inserting ${seededProducts.length} products...`);
    const result = await productModel.insertMany(seededProducts);
    console.log(`Successfully seeded ${result.length} products into the database!`);

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
