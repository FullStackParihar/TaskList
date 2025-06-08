// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import TaskList from './TaskList';
// import { useNavigate } from 'react-router-dom';
// import baseurl from '../utils/api';

// const TaskBoard = () => {
//   const [lists, setLists] = useState([]);
//   const [newListTitle, setNewListTitle] = useState('');

//     const navigate = useNavigate();

  
//   useEffect(() => {
//     loadLists();
//   }, []);

 
//   const loadLists = async () => {
//     try {
//       const response = await axios.get(`${baseurl}/list/lists`);
//       setLists(response.data);
//     } catch (error) {
//       console.error('Error loading lists:', error);
//       alert('Error loading lists');
//     }
//   };

  
//   const createList = async () => {
//     if (!newListTitle.trim()) {
//       alert('Please enter a list title');
//       return;
//     }

//     try {
//       const response = await axios.post(`${baseurl}/list/list/create`, {
//         title: newListTitle,
//       });
//       setLists([...lists, { ...response.data, tasks: [] }]);
//       setNewListTitle('');
//     } catch (error) {
//       console.error('Error creating list:', error);
//       alert('Error creating list');
//     }
//   };
// const handlelogout = async () => {

//     navigate('/login');
//     localStorage.removeItem('token');
// }
//   return (
//     <div className="container mx-auto p-6">
 
//       <div className="mb-6">
//         <h1 className="text-4xl font-bold text-gray-800 text-center">Task Board</h1>
//       </div>
//       <button className='bg-red-400 p-2 rounded' onClick={handlelogout}>logout</button>

    
//       <div className="flex justify-center mb-6">
//         <input
//           type="text"
//           className="border-2 border-gray-300 rounded-lg p-2 mr-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           placeholder="New List Title..."
//           value={newListTitle}
//           onChange={(e) => setNewListTitle(e.target.value)}
//           onKeyDown={(e) => e.key === 'Enter' && createList()}
//         />
//         <button
//           className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 transition"
//           onClick={createList}
//         >
//           Create New List
//         </button>
//       </div>
 
//       <div className="list-container flex overflow-x-auto space-x-4 pb-4">
//         {lists.map((list) => (
//           <TaskList
//             key={list._id}
//             list={list}
//             setLists={setLists}
//             lists={lists}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default TaskBoard;




import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import TaskList from './TaskList';
import { useNavigate } from 'react-router-dom';
import baseurl from '../utils/api';

const TaskBoard = () => {
  const [lists, setLists] = useState([]);
  const [newListTitle, setNewListTitle] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();

  // Load lists on component mount
  useEffect(() => {
    loadLists();
  }, []);

  // Memoized function to load lists
  const loadLists = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get(`${baseurl}/list/lists`);
      setLists(response.data);
    } catch (error) {
      console.error('Error loading lists:', error);
      setError('Failed to load lists. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Enhanced create list function
  const createList = async () => {
    const trimmedTitle = newListTitle.trim();
    
    if (!trimmedTitle) {
      setError('Please enter a list title');
      return;
    }

    if (trimmedTitle.length > 50) {
      setError('List title must be 50 characters or less');
      return;
    }

    try {
      setIsCreating(true);
      setError(null);
      
      const response = await axios.post(`${baseurl}/list/list/create`, {
        title: trimmedTitle,
      });
      
      setLists(prevLists => [...prevLists, { ...response.data, tasks: [] }]);
      setNewListTitle('');
    } catch (error) {
      console.error('Error creating list:', error);
      setError('Failed to create list. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  // Enhanced logout function
  const handleLogout = useCallback(async () => {
    try {
      // Optional: Call logout endpoint if you have one
      // await axios.post(`${baseurl}/auth/logout`);
      
      localStorage.removeItem('token');
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Error during logout:', error);
      // Still remove token and navigate even if API call fails
      localStorage.removeItem('token');
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.ctrlKey && e.key === 'Enter') {
        createList();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [newListTitle]);

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your task board...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-4xl font-bold text-gray-800">Task Board</h1>
          <button 
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium shadow-sm"
            onClick={handleLogout}
            aria-label="Logout"
          >
            Logout
          </button>
        </div>
        
        {/* Stats */}
        <div className="text-sm text-gray-600">
          {lists.length} {lists.length === 1 ? 'list' : 'lists'} • 
          {lists.reduce((total, list) => total + (list.tasks?.length || 0), 0)} total tasks
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="text-red-500 hover:text-red-700 ml-4"
            aria-label="Dismiss error"
          >
            ×
          </button>
        </div>
      )}

      {/* Create New List Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Create New List</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <input
              type="text"
              className="w-full border-2 border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter list title... (Ctrl+Enter to create)"
              value={newListTitle}
              onChange={(e) => setNewListTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.ctrlKey && createList()}
              maxLength={50}
              disabled={isCreating}
            />
            <div className="text-xs text-gray-500 mt-1">
              {newListTitle.length}/50 characters
            </div>
          </div>
          <button
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white rounded-lg px-6 py-3 font-medium transition-colors duration-200 shadow-sm min-w-[140px]"
            onClick={createList}
            disabled={isCreating || !newListTitle.trim()}
          >
            {isCreating ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating...
              </span>
            ) : (
              'Create List'
            )}
          </button>
        </div>
      </div>

      {/* Lists Container */}
      {lists.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📋</div>
          <h3 className="text-xl font-medium text-gray-600 mb-2">No lists yet</h3>
          <p className="text-gray-500">Create your first list to get started with organizing your tasks!</p>
        </div>
      ) : (
        <div className="lists-container">
          <div className="flex overflow-x-auto space-x-6 pb-6">
            {lists.map((list) => (
              <div key={list._id} className="flex-shrink-0">
                <TaskList
                  list={list}
                  setLists={setLists}
                  lists={lists}
                />
              </div>
            ))}
          </div>
          
          {/* Scroll hint for mobile */}
          {lists.length > 1 && (
            <div className="text-center text-sm text-gray-500 mt-4 sm:hidden">
              ← Swipe to see more lists →
            </div>
          )}
        </div>
      )}

      {/* Refresh button for manual reload */}
      <div className="fixed bottom-6 right-6">
        <button
          onClick={loadLists}
          className="bg-white hover:bg-gray-50 text-gray-600 p-3 rounded-full shadow-lg border border-gray-200 transition-colors duration-200"
          aria-label="Refresh lists"
          title="Refresh lists"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default TaskBoard;