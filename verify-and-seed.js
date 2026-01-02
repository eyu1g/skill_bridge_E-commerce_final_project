const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

// Use the exact same connection string
const MONGODB_URI = 'mongodb+srv://SheRise-MVP:Sherise123@cluster0.tsckxqi.mongodb.net/skillbridge?retryWrites=true&w=majority';

const User = require('./src/models/User');
const Product = require('./src/models/Product');

async function verifyAndSeed() {
  try {
    console.log('🔄 Connecting to skillbridge database...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to skillbridge MongoDB');

    // Check collections
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('📊 Collections found:', collections.map(c => c.name));

    // Check products count
    const productCount = await Product.countDocuments();
    console.log(`📦 Products in database: ${productCount}`);

    // Get all products to see their structure
    const allProducts = await Product.find({}).lean();
    console.log('🔍 Products structure:');
    allProducts.forEach((product, index) => {
      console.log(`Product ${index + 1}:`, {
        id: product.id,
        name: product.name,
        price: product.price,
        stock: product.stock,
        hasCreatedAt: !!product.createdAt
      });
    });

    if (productCount === 0) {
      console.log('🌱 No products found. Seeding database...');
      
      // Get admin user
      const admin = await User.findOne({ role: 'ADMIN' });
      if (!admin) {
        console.log('❌ No admin user found. Creating admin first...');
        const adminId = uuidv4();
        const hashedPassword = await bcrypt.hash('Admin123!', 10);
        admin = await User.create({
          id: adminId,
          username: 'admin',
          email: 'admin@skillbridge.com',
          password: hashedPassword,
          role: 'ADMIN'
        });
        console.log('✅ Created admin user');
      }

      // Create products
      const products = [
        {
          id: uuidv4(),
          name: 'Premium Laptop',
          description: 'High-performance laptop with latest specs for professionals and gamers. Features include Intel i7 processor, 16GB RAM, 512GB SSD, and dedicated graphics card.',
          price: 1299.99,
          stock: 25,
          category: 'Electronics',
          userId: admin.id
        },
        {
          id: uuidv4(),
          name: 'Wireless Headphones',
          description: 'Premium noise-cancelling wireless headphones with 30-hour battery life and superior sound quality. Perfect for music lovers and professionals.',
          price: 199.99,
          stock: 50,
          category: 'Electronics',
          userId: admin.id
        },
        {
          id: uuidv4(),
          name: 'Smart Watch',
          description: 'Advanced fitness tracking smartwatch with heart rate monitor, GPS, and smartphone integration. Water-resistant with 7-day battery life.',
          price: 299.99,
          stock: 35,
          category: 'Electronics',
          userId: admin.id
        },
        {
          id: uuidv4(),
          name: 'Ergonomic Office Chair',
          description: 'Comfortable ergonomic office chair with lumbar support, adjustable height, and breathable mesh backing. Designed for long working hours.',
          price: 449.99,
          stock: 15,
          category: 'Furniture',
          userId: admin.id
        },
        {
          id: uuidv4(),
          name: 'Mechanical Keyboard',
          description: 'Professional mechanical gaming keyboard with RGB backlighting, programmable keys, and tactile switches. Built for durability and performance.',
          price: 149.99,
          stock: 40,
          category: 'Electronics',
          userId: admin.id
        },
        {
          id: uuidv4(),
          name: '4K Webcam',
          description: 'Ultra HD 4K webcam with auto-focus, noise reduction, and wide-angle lens. Ideal for video conferencing and content creation.',
          price: 129.99,
          stock: 30,
          category: 'Electronics',
          userId: admin.id
        },
        {
          id: uuidv4(),
          name: 'Standing Desk Converter',
          description: 'Adjustable standing desk converter that transforms any regular desk into a standing workspace. Promotes better posture and productivity.',
          price: 399.99,
          stock: 20,
          category: 'Furniture',
          userId: admin.id
        },
        {
          id: uuidv4(),
          name: 'Portable SSD',
          description: 'High-speed 1TB portable SSD with USB-C connectivity. Compact, durable, and perfect for data backup and transfer on the go.',
          price: 89.99,
          stock: 60,
          category: 'Electronics',
          userId: admin.id
        }
      ];

      await Product.insertMany(products);
      console.log(`✅ Created ${products.length} products!`);

      // Verify after seeding
      const newCount = await Product.countDocuments();
      console.log(`📦 New product count: ${newCount}`);
    }

    // Test the exact query that the API uses
    console.log('\n🧪 Testing API query...');
    const apiProducts = await Product.find({})
      .sort({ createdAt: -1 })
      .skip(0)
      .limit(10)
      .select('id name price stock category -_id')
      .lean();
    
    console.log(`📊 API query results: ${apiProducts.length} products`);
    if (apiProducts.length > 0) {
      console.log('✅ First API product:', apiProducts[0]);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

verifyAndSeed();
