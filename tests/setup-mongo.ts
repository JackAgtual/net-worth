import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

export function setupMongoTestDb() {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create({
      binary: { version: "6.0.7" },
    });

    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  });

  afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany();
    }
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });
}
