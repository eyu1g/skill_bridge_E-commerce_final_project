const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

// Set the MongoDB URI directly
process.env.MONGODB_URI = 'mongodb+srv://SheRise-MVP:Sherise123@cluster0.tsckxqi.mongodb.net/skillbridge?retryWrites=true&w=majority';

const User = require('./src/models/User');
const Product = require('./src/models/Product');

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    console.log('✅ Cleared existing data');

    // Create admin user
    const adminId = uuidv4();
    const hashedPassword = await bcrypt.hash('Admin123!', 10);
    
    const admin = await User.create({
      id: adminId,
      username: 'admin',
      email: 'admin@skillbridge.com',
      password: hashedPassword,
      role: 'ADMIN'
    });

    // Create regular user
    const userId = uuidv4();
    const userPassword = await bcrypt.hash('User123!', 10);
    
    const user = await User.create({
      id: userId,
      username: 'testuser',
      email: 'user@skillbridge.com',
      password: userPassword,
      role: 'USER'
    });

    console.log('✅ Created users:', { admin: admin.email, user: user.email });

    // Create sample products
    const products = [
      {
        id: uuidv4(),
        name: 'Premium Laptop',
        description: 'High-performance laptop with latest specs for professionals and gamers. Features include Intel i7 processor, 16GB RAM, 512GB SSD, and dedicated graphics card.',
        price: 1299.99,
        stock: 25,
        category: 'Electronics',
        userId: adminId
      },
      {
        id: uuidv4(),
        name: 'Wireless Headphones',
        description: 'Premium noise-cancelling wireless headphones with 30-hour battery life and superior sound quality. Perfect for music lovers and professionals.',
        price: 199.99,
        stock: 50,
        category: 'Electronics',
        userId: adminId
      },
      {
        id: uuidv4(),
        name: 'Smart Watch',
        description: 'Advanced fitness tracking smartwatch with heart rate monitor, GPS, and smartphone integration. Water-resistant with 7-day battery life.',
        price: 299.99,
        stock: 35,
        category: 'Electronics',
        userId: adminId
      },
      {
        id: uuidv4(),
        name: 'Ergonomic Office Chair',
        description: 'Comfortable ergonomic office chair with lumbar support, adjustable height, and breathable mesh backing. Designed for long working hours.',
        price: 449.99,
        stock: 15,
        category: 'Furniture',
        userId: adminId
      },
      {
        id: uuidv4(),
        name: 'Mechanical Keyboard',
        description: 'Professional mechanical gaming keyboard with RGB backlighting, programmable keys, and tactile switches. Built for durability and performance.',
        price: 149.99,
        stock: 40,
        category: 'Electronics',
        userId: adminId
      },
      {
        id: uuidv4(),
        name: '4K Webcam',
        description: 'Ultra HD 4K webcam with auto-focus, noise reduction, and wide-angle lens. Ideal for video conferencing and content creation.',
        price: 129.99,
        stock: 30,
        category: 'Electronics',
        userId: adminId
      },
      {
        id: uuidv4(),
        name: 'Standing Desk Converter',
        description: 'Adjustable standing desk converter that transforms any regular desk into a standing workspace. Promotes better posture and productivity.',
        price: 399.99,
        stock: 20,
        category: 'Furniture',
        userId: adminId
      },
      {
        id: uuidv4(),
        name: 'Portable SSD',
        description: 'High-speed 1TB portable SSD with USB-C connectivity. Compact, durable, and perfect for data backup and transfer on the go.',
        price: 89.99,
        stock: 60,
        category: 'Electronics',
        userId: adminId
      }
    ];

    await Product.insertMany(products);
    console.log(`✅ Created ${products.length} sample products`);

    console.log('\n=== Database Seeded Successfully ===');
    console.log('📧 Admin credentials:');
    console.log('   Email: admin@skillbridge.com');
    console.log('   Password: Admin123!');
    console.log('\n📧 User credentials:');
    console.log('   Email: user@skillbridge.com');
    console.log('   Password: User123!');

  } catch (error) {
    console.error('❌ Seeding error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

seedDatabase();
