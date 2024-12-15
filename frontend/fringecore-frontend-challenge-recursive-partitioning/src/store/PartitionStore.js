import { makeAutoObservable } from "mobx";

class PartitionStore {
  partitions = [
    {
      id: "root",
      direction: null,
      color: getRandomColor(),
      children: [],
    },
  ];

  constructor() {
    makeAutoObservable(this);
  }

  splitPartition(id, direction) {
    const partition = this.findPartitionById(this.partitions, id);
    if (partition) {
      const newChild1 = {
        id: `${id}-1`,
        direction: null,
        color: getRandomColor(),
        children: [],
      };
      const newChild2 = {
        id: `${id}-2`,
        direction: null,
        color: getRandomColor(),
        children: [],
      };
      partition.direction = direction;
      partition.children = [newChild1, newChild2];
    }
  }

  removePartition(id) {
    this.removePartitionRecursive(this.partitions, id);
  }

  removePartitionRecursive(partitions, id) {
    for (let i = 0; i < partitions.length; i++) {
      if (partitions[i].id === id) {
        partitions.splice(i, 1);
        return true;
      }
      if (partitions[i].children.length) {
        const removed = this.removePartitionRecursive(partitions[i].children, id);
        if (removed) return true;
      }
    }
    return false;
  }

  findPartitionById(partitions, id) {
    for (const partition of partitions) {
      if (partition.id === id) return partition;
      if (partition.children.length) {
        const found = this.findPartitionById(partition.children, id);
        if (found) return found;
      }
    }
    return null;
  }
}

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

const store = new PartitionStore();
export default store;
