import kafka from "@/kafka/kafka-config"; // Import the Kafka instance

const producer = kafka.producer();

export const sendLikeEvent = async (postId: string, userId: string) => {
  await producer.connect();
  await producer.send({
    topic: "like-topic",
    messages: [
      {
        key: postId,
        value: JSON.stringify({
          userId,
          postId,
          eventType: "like",
          timestamp: new Date(),
        }),
      },
    ],
  });
  await producer.disconnect();
};
