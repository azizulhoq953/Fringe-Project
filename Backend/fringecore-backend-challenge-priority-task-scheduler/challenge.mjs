// note please at a time more than 3 request pass then show properly priority queue
const TASK_REQUIRE_TIME_MS = 5000; 
const taskQueue = [];

let isProcessing = false;


const sortQueue = () => {
  taskQueue.sort((a, b) => b.priority - a.priority || a.timestamp - b.timestamp);
};
const processNextTask = () => {
  if (isProcessing || taskQueue.length === 0) {
    return; // If already processing or no tasks left, do nothing
  }
  sortQueue();
  const nextTask = taskQueue.shift(); // Get the highest priority task
  isProcessing = true; // Mark the task as being processed

  console.log(`Processing Task ID: ${nextTask.id} with priority: ${nextTask.priority}`);
  setTimeout(() => {
    // Task is done, call the callback to mark it as done
    nextTask.setTaskDone(`Task ${nextTask.id} completed with priority ${nextTask.priority}`);
    console.log(`Finished Task ID: ${nextTask.id} with priority: ${nextTask.priority}`);
    isProcessing = false; // Mark processing as done and process the next task

    processNextTask();     // Process the next task in the queue
  }, TASK_REQUIRE_TIME_MS);
};

/**
 * Adds a task to the queue and starts processing.
 *
 * @param {Object} task - The task object containing details about the task.
 * @param {string} task.id - Unique identifier for the task.
 * @param {number} task.priority - Priority level of the task (higher = more urgent).
 * @param {string} task.description - A description of the task.
 * @param {function} task.setTaskDone - Callback function to mark the task as complete.
 */
export const processTask = (task) => {
  task.timestamp = new Date().getTime();
  taskQueue.push(task);
  console.log(`Task ID: ${task.id} with priority: ${task.priority} added to the queue`);
  processNextTask();
};
