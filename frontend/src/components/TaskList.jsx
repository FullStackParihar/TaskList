import React, { useState } from 'react';
import axios from 'axios';
import Task from './Task';
import baseurl from '../utils/api';

const TaskList = ({ list, setLists, lists }) => {
  const [newTaskTitle, setNewTaskTitle] = useState('');

 
  const createTask = async () => {
    if (!newTaskTitle.trim()) {
      alert('Please enter a task title');
      return;
    }

    try {
      const response = await axios.post(`${baseurl}/task/task/create`, {
        listId: list._id,
        title: newTaskTitle,
      });
      setLists(
        lists.map((l) =>
          l._id === list._id
            ? { ...l, tasks: [...l.tasks, response.data] }
            : l
        )
      );
      setNewTaskTitle('');
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Error creating task');
    }
  };

   
  const handleDrop = async (e) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    const sourceListId = e.dataTransfer.getData('sourceListId');

    if (sourceListId === list._id) return;

    try {
      const response = await axios.put(`${baseurl}/task/task/move`, {
        taskId,
        newListId: list._id,
      });
      setLists(
        lists.map((l) => {
          if (l._id === sourceListId) {
            return { ...l, tasks: l.tasks.filter((task) => task._id !== taskId) };
          }
          if (l._id === list._id) {
            return { ...l, tasks: [...l.tasks, response.data] };
          }
          return l;
        })
      );
    } catch (error) {
      console.error('Error moving task:', error);
      alert('Error moving task');
    }
  };

  return (
    <div
      className="list bg-white rounded-lg shadow-lg p-4 min-w-[300px] border border-gray-200"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <h2 className="text-xl font-semibold text-gray-700 mb-3 border-b pb-2">
        {list.title}
      </h2>

 
      {list.tasks.map((task) => (
        <Task
          key={task._id}
          task={task}
          listId={list._id}
          setLists={setLists}
          lists={lists}
        />
      ))}

     
      <div className="mt-3">
        <input
          type="text"
          className="border-2 border-gray-300 rounded-lg p-2 w-full mb-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="New Task..."
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && createTask()}
        />
        <button
          className="bg-green-500 text-white rounded-lg p-2 w-full hover:bg-green-600 transition"
          onClick={createTask}
        >
          Add Task
        </button>
      </div>
    </div>
  );
};

export default TaskList;