class PriorityQueue {
    constructor() {
      this.tasks = [];
    }
    enqueue(task) {
      this.tasks.push(task);
      this.tasks.sort((a, b) => a.priority - b.priority || a.createdAt - b.createdAt);
    }
    dequeue() {
      return this.tasks.shift();
    }
  }
  
  module.exports = new PriorityQueue();
  