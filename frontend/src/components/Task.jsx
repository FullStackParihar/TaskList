import React from 'react';
import axios from 'axios';

const Task = ({ task, listId, setLists, lists }) => {
 
  const handleDragStart = (e) => {
    e.dataTransfer.setData('taskId', task._id);
    e.dataTransfer.setData('sourceListId', listId);
    e.target.classList.add('dragging');
  };

 
  const handleDragEnd = (e) => {
    e.target.classList.remove('dragging');
  };

 
  const markTaskCompleted = async () => {
    try {
      await axios.put('http://localhost:5000/task/task/complete', {
        taskId: task._id,
      });
      setLists(
        lists.map((list) =>
          list._id === listId
            ? { ...list, tasks: list.tasks.filter((t) => t._id !== task._id) }
            : list
        )
      );
    } catch (error) {
      console.error('Error marking task as completed:', error);
      alert('Error marking task as completed');
    }
  };

  return (
    <div
      className="task bg-gray-50 rounded-lg p-3 mb-2 flex justify-between items-center border border-gray-200 shadow-sm"
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <span className="text-gray-800">{task.title}</span>
      <button
        className="text-green-500 hover:text-green-700 transition"
        onClick={markTaskCompleted}
      >
        ✓
      </button>
    </div>
  );
};

export default Task;