import mongoose from "mongoose";

const connectStatus = {};

async function connect() {
  if (connectStatus.isConnected) {
    console.log("already connected");
    return;
  }
  if (mongoose.connections.length > 0) {
    connectStatus.isConnected = mongoose.connections[0].readyState;
    if (connectStatus.isConnected === 1) {
      console.log("use previous connection");
      return;
    }
    await mongoose.disconnect();
  }
  const db = await mongoose.connect(process.env.MONGODB_URI);
  console.log("new connection");
  connectStatus.isConnected = db.connections[0].readyState;
}

async function disconnect() {
  if (connectStatus.isConnected) {
    if (process.env.NODE_ENV === "production") {
      await mongoose.disconnect();
      connectStatus.isConnected = false;
    } else {
      console.log("not disconnected");
    }
  }
}

function covertDocToObj(doc) {
  doc._id = doc._id.toString()
  doc.createdAt = doc.createdAt.toString()
  doc.updatedAt = doc.updatedAt.toString()
  return doc
}

const db = { connect, disconnect, covertDocToObj };
export default db;
