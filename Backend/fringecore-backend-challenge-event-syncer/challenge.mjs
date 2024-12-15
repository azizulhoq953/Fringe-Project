
const events = new Map(); 
function initializeKey(key) {
  if (!events.has(key)) {
    events.set(key, {
      queue: [],
      consumedByGroups: new Map(),
      waitingResolvers: [], 
    });
  }
}
function scheduleEventCleanup(key, event) {
  setTimeout(() => {
    const keyData = events.get(key);
    if (keyData) {
      keyData.queue = keyData.queue.filter((e) => e !== event);
      if (keyData.queue.length === 0 && keyData.waitingResolvers.length === 0) {
        events.delete(key); 
      }
    }
  }, 120000);
}
export async function blockingGet(key, groupId) {
    initializeKey(key);
    const keyData = events.get(key);
    if (!keyData.consumedByGroups.has(groupId)) {
      keyData.consumedByGroups.set(groupId, []);
    }
    const consumedIndices = keyData.consumedByGroups.get(groupId);
    const unconsumedEvents = keyData.queue.filter(
      (_, index) => !consumedIndices.includes(index)
    );
    if (unconsumedEvents.length > 0) {
      const newConsumedIndices = unconsumedEvents.map((_, index) => index);
      keyData.consumedByGroups.set(groupId, [...consumedIndices, ...newConsumedIndices]);
      return unconsumedEvents;
    }
    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        resolve([]);
      }, 30000);
  
      keyData.waitingResolvers.push((newEvent) => {
        clearTimeout(timeout);
  
        const newEventIndex = keyData.queue.indexOf(newEvent);
        keyData.consumedByGroups.get(groupId).push(newEventIndex);
  
        resolve([newEvent]);
      });
    });
  }
export async function push(key, data) {
  initializeKey(key);
  const keyData = events.get(key);
  keyData.queue.push(data);
  scheduleEventCleanup(key, data);
  if (keyData.waitingResolvers.length > 0) {
    const resolver = keyData.waitingResolvers.shift();
    resolver(data); 
  }
}
