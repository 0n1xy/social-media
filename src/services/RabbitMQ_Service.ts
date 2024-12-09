import amqp, { Connection, Channel, ConsumeMessage } from "amqplib";
//process.env.RABBITMQ_USERNAME ||
//process.env.RABBITMQ_PASSWORD ||
const rabbitSettings = {
  protocol: "amqp",
  hostname: process.env.RABBITMQ_HOST || "rabbitmq",
  port: Number(process.env.RABBITMQ_PORT) || 5672,
  username: "guest",
  password: "guest",
  vhost: "/",
  authMechanism: ["PLAIN", "AMQPLAIN", "EXTERNAL"],
};

let connection: Connection | null = null;
const channels: { [queue: string]: Channel } = {};
const queueFollowNotification = "FollowNotification";
const queNotification = "Notification";

/**
 * Kết nối đến RabbitMQ nếu chưa kết nối.
 */
export async function connectToRabbitMQ(): Promise<Connection> {
  if (!connection) {
    try {
      connection = await amqp.connect(rabbitSettings);
      console.log("RabbitMQ connected.");
    } catch (error) {
      console.error("Failed to connect to RabbitMQ:", (error as Error).message);
      throw error;
    }
  }
  return connection;
}

/**
 * Tạo hoặc tái sử dụng channel cho queue được chỉ định.
 */
export async function getChannel(queueName: string): Promise<Channel> {
  if (!channels[queueName]) {
    try {
      const conn = await connectToRabbitMQ();
      const channel = await conn.createChannel();
      await channel.assertQueue(queueName, { durable: true });
      channels[queueName] = channel;
      console.log(`Channel created for queue: ${queueName}`);
    } catch (error) {
      console.error(
        `Failed to create channel for queue "${queueName}":`,
        (error as Error).message
      );
      throw error;
    }
  }
  return channels[queueName];
}

/**
 * Đóng kết nối RabbitMQ.
 */
export async function closeRabbitMQConnection(): Promise<void> {
  if (connection) {
    await connection.close();
    console.log("RabbitMQ connection closed.");
    connection = null;
    for (const queue in channels) {
      delete channels[queue];
    }
  }
}

/**
 * Gửi yêu cầu Follow tới RabbitMQ.
 */

/**
 * Nhận và xử lý yêu cầu Follow từ RabbitMQ.
 */
export async function receiveFollowRequest(): Promise<void> {
  try {
    const channel = await getChannel(queueFollowNotification);

    console.log(`Waiting for messages in queue: ${queueFollowNotification}`);

    channel.consume(
      queueFollowNotification,
      async (message: ConsumeMessage | null) => {
        if (!message) {
          console.warn("Received null message.");
          return;
        }

        const msgContent = message.content.toString();
        console.log(`Received message: ${msgContent}`);

        try {
          const parsedMessage = JSON.parse(msgContent);
          if (parsedMessage?.userId && parsedMessage?.message) {
            console.log(
              `Processed Follow Request: FollowerID=${parsedMessage.userId}, Message=${parsedMessage.message}`
            );

            // Add your additional processing logic here
          } else {
            console.error("Invalid message format:", parsedMessage);
          }

          // Acknowledge successful processing
          channel.ack(message);
        } catch (error) {
          console.error("Failed to process message:", (error as Error).message);

          // Reject the message and do not requeue it
          channel.nack(message, false, false);
        }
      },
      { noAck: false } // Require explicit acknowledgment
    );
  } catch (error) {
    console.error(
      `Failed to receive messages from queue "${queueFollowNotification}":`,
      (error as Error).message
    );
    throw error;
  }
}
