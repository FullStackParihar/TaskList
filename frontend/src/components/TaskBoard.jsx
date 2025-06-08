import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TaskList from './TaskList';
import { useNavigate } from 'react-router-dom';

const TaskBoard = () => {
  const [lists, setLists] = useState([]);
  const [newListTitle, setNewListTitle] = useState('');

    const navigate = useNavigate();

  
  useEffect(() => {
    loadLists();
  }, []);

 
  const loadLists = async () => {
    try {
      const response = await axios.get('http://localhost:5000/list/lists');
      setLists(response.data);
    } catch (error) {
      console.error('Error loading lists:', error);
      alert('Error loading lists');
    }
  };

  
  const createList = async () => {
    if (!newListTitle.trim()) {
      alert('Please enter a list title');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/list/list/create', {
        title: newListTitle,
      });
      setLists([...lists, { ...response.data, tasks: [] }]);
      setNewListTitle('');
    } catch (error) {
      console.error('Error creating list:', error);
      alert('Error creating list');
    }
  };
const handlelogout = async () => {

    navigate('/login');
    localStorage.removeItem('token');
}
  return (
    <div className="container mx-auto p-6">
 
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-gray-800 text-center">Task Board</h1>
      </div>
      <button className='bg-red-400 p-2 rounded' onClick={handlelogout}>logout</button>

    
      <div className="flex justify-center mb-6">
        <input
          type="text"
          className="border-2 border-gray-300 rounded-lg p-2 mr-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="New List Title..."
          value={newListTitle}
          onChange={(e) => setNewListTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && createList()}
        />
        <button
          className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 transition"
          onClick={createList}
        >
          Create New List
        </button>
      </div>
 
      <div className="list-container flex overflow-x-auto space-x-4 pb-4">
        {lists.map((list) => (
          <TaskList
            key={list._id}
            list={list}
            setLists={setLists}
            lists={lists}
          />
        ))}
      </div>
    </div>
  );
};

export default TaskBoard;