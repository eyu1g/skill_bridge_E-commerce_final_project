const mongoose = require('mongoose');
const Product = require('./src/models/Product');

async function debugProducts() {
  try {
    await mongoose.connect('mongodb+srv://SheRise-MVP:Sherise123@cluster0.tsckxqi.mongodb.net/skillbridge?retryWrites=true&w=majority');
    console.log('✅ Connected to database');

    // Get all products without field selection
    const allProducts = await Product.find({}).lean();
    console.log(`📊 Total products found: ${allProducts.length}`);
    
    if (allProducts.length > 0) {
      console.log('🔍 First product structure:', JSON.stringify(allProducts[0], null, 2));
    }

    // Test the exact query from the route
    const routeProducts = await Product.find({})
      .sort({ createdAt: -1 })
      .skip(0)
      .limit(10)
      .select('id name price stock category -_id')
      .lean();
    
    console.log(`📊 Route query results: ${routeProducts.length}`);
    if (routeProducts.length > 0) {
      console.log('🔍 Route result structure:', JSON.stringify(routeProducts[0], null, 2));
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

debugProducts();
