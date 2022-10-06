const connection = {};

async function dbConnect() {
  const mongoose = (await import('mongoose')).default;
  if (connection.isConnected) {
    console.log('Already Connected');
    return;
  }
  if (mongoose.connections.length > 0) {
    connection.isConnected = mongoose.connections[0].readyState;
    if (connection.isConnected === 1) {
      console.log('Previous Connection');
      return;
    }
    await mongoose.disconnect();
  }

  const db = await mongoose.connect(process.env.MONGO_URI);
  console.log('New Connection');
  connection.isConnected = db.connections[0].readyState;
}

async function dbDisconnect() {
  const mongoose = (await import('mongoose')).default;
  if (connection.isConnected) {
    if (process.env.NODE_ENV === 'production') {
      await mongoose.disconnect();
      connection.isConnected = false;
    } else {
      console.log('Not Disconnected');
    }
  }
}

export { dbConnect, dbDisconnect };
