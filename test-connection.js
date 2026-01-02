const mongoose = require('mongoose');

// Test different connection strings
const testConnections = [
  'mongodb+srv://SheRise-MVP:Sherise123@cluster0.tsckxqi.mongodb.net/skillbridge?retryWrites=true&w=majority',
  'mongodb+srv://SheRise-MVP:Sherise123@cluster0.tsckxqi.mongodb.net/test?retryWrites=true&w=majority',
  'mongodb+srv://SheRise-MVP:Sherise123@cluster0.tsckxqi.mongodb.net/?retryWrites=true&w=majority'
];

async function testConnection() {
  for (const uri of testConnections) {
    try {
      console.log(`Testing: ${uri}`);
      await mongoose.connect(uri);
      console.log('✅ SUCCESS: Connected successfully!');
      
      // Test database operations
      const collections = await mongoose.connection.db.listCollections().toArray();
      console.log(`✅ Found ${collections.length} collections`);
      
      await mongoose.disconnect();
      return uri; // Return the working connection string
      
    } catch (error) {
      console.log(`❌ FAILED: ${error.message}`);
      await mongoose.disconnect();
    }
  }
}

testConnection().then(workingUri => {
  if (workingUri) {
    console.log(`\n🎉 Use this connection string: ${workingUri}`);
  } else {
    console.log('\n❌ All connection attempts failed. Check:');
    console.log('1. Network Access settings in MongoDB Atlas');
    console.log('2. Database user credentials');
    console.log('3. Cluster status');
  }
});
