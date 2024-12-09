import {
  getChannel,
  closeRabbitMQConnection,
} from "@/services/RabbitMQ_Service";

export const startFollowWorker = async () => {
  try {
    const queueName = "FollowNotification";
    const channel = await getChannel(queueName);

    console.log(`FollowWorker listening to queue: ${queueName}`);

    channel.consume(
      queueName,
      async (message: any) => {
        if (message) {
          console.log(
            `FollowWorker received message: ${message.content.toString()}`
          );
          // Process the message here...
          channel.ack(message);
        }
      },
      { noAck: false }
    );
  } catch (error) {
    console.error("Error starting FollowWorker:", error);
  }
};
