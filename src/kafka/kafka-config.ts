// config/kafka.ts
import { Kafka } from "kafkajs";

// Create a Kafka instance
const kafka = new Kafka({
  clientId: "social-media-app",
  brokers: [process.env.KAFKA_BROKER || "localhost:9092"], // Use the environment variable or default to localhost for local development
});

// Export the Kafka instance
export default kafka;
