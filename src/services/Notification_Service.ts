// import { Kafka, Producer, Admin, Partitioners } from "kafkajs";

// class KafkaService {
//   private kafka: Kafka;
//   private producer: Producer;
//   private admin: Admin;

//   constructor() {
//     // Initialize the Kafka instance
//     this.kafka = new Kafka({
//       clientId: "social-media-app",
//       brokers: ["kafka-1:9092", "kafka-2:9093"],
//       connectionTimeout: 10000,
//       retry: {
//         retries: 5, // Set retries to a reasonable number
//       },
//     });

//     // Create the producer and admin instances
//     this.producer = this.kafka.producer();
//     this.admin = this.kafka.admin();
//   }

//   // Method to connect the producer and admin
//   private async connect() {
//     await this.producer.connect();
//     await this.admin.connect();
//   }

//   // Method to disconnect the producer and admin
//   private async disconnect() {
//     await this.producer.disconnect();
//     await this.admin.disconnect();
//   }

//   // Method to create a new Kafka topic
//   public async createTopic(topic: string) {
//     const topics = await this.admin.listTopics();

//     // Check if the topic already exists
//     if (!topics.includes(topic)) {
//       console.log(`Creating new topic: ${topic}`);
//       await this.admin.createTopics({
//         topics: [{ topic }],
//       });
//       console.log(`Topic '${topic}' created successfully.`);
//     } else {
//       console.log(`Topic '${topic}' already exists.`);
//     }
//   }

//   // Method to send a 'like' event to Kafka after creating the topic
//   public async sendLikeEvent(postId: string, userId: string): Promise<void> {
//     const topic = "like-topic"; // Define your topic name

//     try {
//       // Connect the producer and admin
//       await this.connect();

//       // Create the topic if it doesn't exist
//       await this.createTopic(topic);

//       // Send the event to the topic
//       await this.producer.send({
//         topic,
//         messages: [
//           {
//             key: postId,
//             value: JSON.stringify({
//               userId,
//               postId,
//               eventType: "like",
//               timestamp: new Date(),
//             }),
//           },
//         ],
//       });
//     } catch (error) {
//       console.error("Failed to send like event to Kafka:", error);
//       throw error; // Rethrow the error for the controller to handle
//     } finally {
//       await this.disconnect();
//     }
//   }
// }

// export default KafkaService;
