const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
// const url = 'mongodb+srv://juliomf:Test1234@cluster0.c9s4i.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
// Connect to the database cluster
const client = new MongoClient(url);
const db = client.db('rental');
const collection = db.collection('house');

async function main() {
  try {
    // Test that you can connect to the database
    await db.command({ ping: 1 });
    console.log(`DB connected to ${config.hostname}`);
  } catch (ex) {
    console.log(`Connection failed to ${url} because ${ex.message}`);
    process.exit(1);
  }

  try {
    // Insert a document
    const house = {
      name: 'Beachfront views',
      summary: 'From your bedroom to the beach, no shoes required',
      property_type: 'Condo',
      beds: 1,
    };
    await collection.insertOne(house);

    // Query the documents
    const query = { property_type: 'Condo', beds: { $lt: 2 } };
    const options = {
      sort: { name: -1 },
      limit: 10,
    };
    const cursor = collection.find(query, options);
    const rentals = await cursor.toArray();
    rentals.forEach((i) => console.log(i));

    // Delete documents
    await collection.deleteMany(query);
  } catch (ex) {
    console.log(`Database (${url}) error: ${ex.message}`);
  } finally {
    await client.close();
  }
}

main();

// // const { MongoClient } = require('mongodb');
// // const config = require('./dbConfig.json');

// // const url = `mongodb+srv://${config.userName}:${encodeURIComponent(config.password)}@${config.hostname}`;

// // // Connect to the database cluster
// // const client = new MongoClient(url);

// // async function main() {
// //   try {
// //     await client.connect(); // 👈 Connect first!

// //     const db = client.db('rental');
// //     const collection = db.collection('house');

// //     // Test the connection
// //     await db.command({ ping: 1 });
// //     console.log(`✅ DB connected to ${config.hostname}`);

// //     // Insert a document
// //     const house = {
// //       name: 'Beachfront views',
// //       summary: 'From your bedroom to the beach, no shoes required',
// //       property_type: 'Condo',
// //       beds: 1,
// //     };
// //     await collection.insertOne(house);

// //     // Query the documents
// //     const query = { property_type: 'Condo', beds: { $lt: 2 } };
// //     const options = {
// //       sort: { name: -1 },
// //       limit: 10,
// //     };
// //     const cursor = collection.find(query, options);
// //     const rentals = await cursor.toArray();
// //     rentals.forEach((i) => console.log(i));

// //     // Delete documents
// //     await collection.deleteMany(query);

// //   } catch (ex) {
// //     console.log(`❌ Error: ${ex.message}`);
// //   } finally {
// //     await client.close();
// //   }
// // }

// // main();
// const { MongoClient } = require('mongodb');
// const config = require('./dbConfig.json');

// const url = `mongodb+srv://${config.userName}:${encodeURIComponent(config.password)}@${config.hostname}/admin?retryWrites=true&w=majority`;

// const client = new MongoClient(url);

// async function main() {
//   try {
//     await client.connect();
//     const adminDb = client.db().admin();

//     // List all databases
//     const { databases } = await adminDb.listDatabases();

//     for (const dbInfo of databases) {
//       const dbName = dbInfo.name;

//       // Skip system DBs
//       if (['admin', 'local', 'config'].includes(dbName)) {
//         continue;
//       }

//       console.log(`🧨 Dropping database: ${dbName}`);
//       await client.db(dbName).dropDatabase();
//     }

//     console.log("✅ All user databases dropped.");
//   } catch (err) {
//     console.error("❌ Error:", err.message);
//   } finally {
//     await client.close();
//   }
// }

// main();
