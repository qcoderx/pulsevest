import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;

let cachedClient: MongoClient | null = null;

async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient;
  }

  if (!MONGODB_URI) {
    throw new Error(
      "MONGODB_URI environment variable is not set. Please add your MongoDB connection string to the environment variables."
    );
  }

  // --- THIS IS THE KEY ADDITION ---
  // We add tlsAllowInvalidCertificates=true to the URI for development flexibility.
  // This helps bypass common local SSL/TLS certificate validation issues.
  const uri = `${MONGODB_URI}&tlsAllowInvalidCertificates=true`;

  const options = {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  };

  // Use the modified URI for the connection
  const client = new MongoClient(uri, options);

  try {
    console.log("Connecting to MongoDB...");
    await client.connect();
    console.log("Successfully connected to MongoDB!");

    cachedClient = client;
    return client;
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    throw new Error(
      `Failed to connect to MongoDB: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

export default connectToDatabase;
