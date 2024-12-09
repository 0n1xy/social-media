// Import all workers
import { startFollowWorker } from "@/worker/Follow_Worker";

// Initialize all workers
export const Workers = () => {
  console.log("Starting all workers...");

  // Start each worker
  startFollowWorker();

  console.log("All workers started successfully.");
};
