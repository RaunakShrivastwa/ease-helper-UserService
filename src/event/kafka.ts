import { Kafka } from "kafkajs";

export const kafka = new Kafka({
  clientId: "ease-helper-user-service",
  brokers: ["localhost:9092"]
});
