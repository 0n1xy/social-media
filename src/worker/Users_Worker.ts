import {
  getChannel,
  closeRabbitMQConnection,
} from "@/services/RabbitMQ_Service";
import axios from "axios";

const queueName = process.env.QUEUE_NAME || "FollowNotification";

/**
 * Hàm xử lý thông điệp nhận được.
 */
async function handleMessage(msgContent: string): Promise<void> {
  try {
    const message = JSON.parse(msgContent);

    if (!message.targetService || !message.payload) {
      throw new Error("Invalid message format");
    }

    const { targetService, payload } = message;

    // Phân phối thông điệp đến service tương ứng
    switch (targetService) {
      case "serviceA":
        await axios.post("http://service-a:3000/api/handle", payload);
        console.log("Message routed to Service A");
        break;
      case "serviceB":
        await axios.post("http://service-b:3000/api/handle", payload);
        console.log("Message routed to Service B");
        break;
      default:
        console.error(`Unknown targetService: ${targetService}`);
    }
  } catch (error) {
    console.error("Failed to handle message:", (error as Error).message);
  }
}

/**
 * Worker bắt đầu lắng nghe queue.
 */
async function startWorker() {
  try {
    const channel = await getChannel(queueName);
    console.log(`Worker listening to queue: ${queueName}`);

    channel.consume(
      queueName,
      async (message: any) => {
        if (message) {
          const msgContent = message.content.toString();
          console.log(`Message received: ${msgContent}`);

          try {
            await handleMessage(msgContent);
            channel.ack(message); // Xác nhận xử lý thành công
          } catch (error) {
            console.error(
              "Failed to process message:",
              (error as Error).message
            );
            channel.nack(message, false, false); // Không tái queue
          }
        }
      },
      { noAck: false }
    );
  } catch (error) {
    console.error(
      `Worker failed to start on queue "${queueName}":`,
      (error as Error).message
    );
    process.exit(1);
  }
}

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("Shutting down Worker...");
  await closeRabbitMQConnection();
  process.exit(0);
});

// Start Worker
startWorker();
