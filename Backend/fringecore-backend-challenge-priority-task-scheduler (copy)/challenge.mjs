// const TASK_REQUIRE_TIME_MS = 5_000;
// // Modify the function below to process each task for 5 secs
// /**
//  * Processes an task and executes a callback to mark the task as done.
//  *
//  * @param {Object} task - The task object containing details about the task.
//  * @param {string} task.id - Unique identifier for the task.
//  * @param {number} task.priority - Priority level of the task (higher is more urgent).
//  * @param {string} task.description - A description of the task. Can be empty string.
//  * @param {function(string | undefined):void} task.setTaskDone - Callback function to mark the task as complete.
//  * It receives an optional message string.
//  */
// // export const processTask = (task) => {
// //   task.setTaskDone("Not implemented");
// // };


// const TASK_REQUIRE_TIME_MS = 5_000; // Task time required for processing

// // Queue to store the tasks
// const taskQueue = [];

// // Flag to indicate if a task is being processed
// let isProcessing = false;

// /**
//  * Processes the next task based on priority.
//  */
// const processNextTask = () => {
//   if (isProcessing || taskQueue.length === 0) {
//     return; // Do nothing if a task is already being processed or no tasks left
//   }

//   // Sort tasks by priority (higher first) and by timestamp if priorities are the same
//   taskQueue.sort((a, b) => b.priority - a.priority || a.timestamp - b.timestamp);

//   // Get the highest-priority task
//   const nextTask = taskQueue.shift();

//   // Mark the task as processing
//   isProcessing = true;

//   console.log(`Processing Task ID: ${nextTask.id} with priority: ${nextTask.priority}`);

//   // Simulate task processing for 5 seconds
//   setTimeout(() => {
//     // Send task completion message
//     nextTask.setTaskDone(`Task ${nextTask.id} completed with priority ${nextTask.priority}`);

//     console.log(`Finished Task ID: ${nextTask.id} with priority: ${nextTask.priority}`);

//     // Mark the task as done and set the flag to allow processing of the next task
//     isProcessing = false;

//     // Continue with the next task in the queue
//     processNextTask();
//   }, TASK_REQUIRE_TIME_MS);
// };

// /**
//  * Adds a task to the queue and triggers processing.
//  *
//  * @param {Object} task - The task object containing details about the task.
//  * @param {string} task.id - Unique identifier for the task.
//  * @param {number} task.priority - Priority level of the task (higher = more urgent).
//  * @param {string} task.description - A description of the task.
//  * @param {function} task.setTaskDone - Callback function to mark the task as complete.
//  */
// export const processTask = (task) => {
//   // Add timestamp to the task to ensure we can sort it by arrival time if needed
//   task.timestamp = new Date().getTime();

//   // Push the task to the queue
//   taskQueue.push(task);

//   console.log(`Task ID: ${task.id} with priority: ${task.priority} added to the queue`);

//   // If no task is processing, start processing tasks
//   processNextTask();
// };


const TASK_REQUIRE_TIME_MS = 5000; // Time each task takes to process

// Queue to store tasks (sorted by priority)
const taskQueue = [];

// Flag to indicate if a task is currently being processed
let isProcessing = false;

/**
 * Sorts the queue by priority (higher priority first).
 */
const sortQueue = () => {
  // Sort by priority, higher priority first
  taskQueue.sort((a, b) => b.priority - a.priority || a.timestamp - b.timestamp);
};

/**
 * Processes the next task in the queue.
 */
const processNextTask = () => {
  if (isProcessing || taskQueue.length === 0) {
    return; // If already processing or no tasks left, do nothing
  }

  // Sort the queue to ensure the highest priority task is first
  sortQueue();

  // Get the highest priority task
  const nextTask = taskQueue.shift();

  // Mark the task as being processed
  isProcessing = true;

  console.log(`Processing Task ID: ${nextTask.id} with priority: ${nextTask.priority}`);

  // Simulate task processing for 5 seconds
  setTimeout(() => {
    // Task is done, call the callback to mark it as done
    nextTask.setTaskDone(`Task ${nextTask.id} completed with priority ${nextTask.priority}`);
    console.log(`Finished Task ID: ${nextTask.id} with priority: ${nextTask.priority}`);

    // Mark processing as done and process the next task
    isProcessing = false;

    // Process the next task in the queue
    processNextTask();
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
  // Add timestamp to the task to ensure correct sorting if priorities are the same
  task.timestamp = new Date().getTime();

  // Add the task to the queue
  taskQueue.push(task);

  console.log(`Task ID: ${task.id} with priority: ${task.priority} added to the queue`);

  // If no task is currently being processed, start processing tasks
  processNextTask();
};
