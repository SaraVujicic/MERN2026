const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const productModel = require('./models/productModel');

async function addMissingProducts() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/mern';
    console.log('Connecting to MongoDB at:', mongoUri);
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    const productsPath = path.join(__dirname, 'products.json');
    if (!fs.existsSync(productsPath)) {
      throw new Error(`products.json not found at ${productsPath}`);
    }

    const rawData = fs.readFileSync(productsPath, 'utf8');
    const productsData = JSON.parse(rawData);

    let inserted = 0;
    for (const item of productsData) {
      const exists = await productModel.findOne({ productName: item.name });
      if (exists) continue;

      const originalPrice = Math.round(item.price * 1.2);
      const productDoc = {
        productName: item.name,
        brandName: 'Sara Fashion',
        category: item.category,
        productImage: Array.isArray(item.image) ? item.image : [item.image],
        description: item.description,
        price: originalPrice,
        sellingPrice: item.price,
        countInStock: item.countInStock || 0,
      };

      await productModel.create(productDoc);
      inserted++;
      console.log('Inserted:', item.name);
    }

    console.log(`Done. Inserted ${inserted} new product(s).`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error adding missing products:', error);
    process.exit(1);
  }
}

addMissingProducts();
