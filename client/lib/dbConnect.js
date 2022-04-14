import mongoose from 'mongoose';

/**
 Source :
 https://github.com/vercel/next.js/blob/canary/examples/with-mongodb-mongoose/utils/dbConnect.js
 * */

const {
  MONGODB_URI, MONGODB_DB, MONGODB_PWD, MONGODB_PROTOCOL, MONGODB_OPTIONS, MONGODB_USER,
} = process.env;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local',
  );
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  // eslint-disable-next-line no-multi-assign
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      bufferCommands: false,
    };

    const finalUri = `${MONGODB_PROTOCOL}${MONGODB_USER}:${MONGODB_PWD}@${MONGODB_URI}${MONGODB_OPTIONS}`;

    // eslint-disable-next-line no-shadow
    cached.promise = mongoose.connect(finalUri, opts).then((mongoose) => mongoose);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
