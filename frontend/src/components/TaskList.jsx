// import React, { useState } from 'react';
// import axios from 'axios';
// import Task from './Task';
// import baseurl from '../utils/api';

// const TaskList = ({ list, setLists, lists }) => {
//   const [newTaskTitle, setNewTaskTitle] = useState('');

 
//   const createTask = async () => {
//     if (!newTaskTitle.trim()) {
//       alert('Please enter a task title');
//       return;
//     }

//     try {
//       const response = await axios.post(`${baseurl}/task/task/create`, {
//         listId: list._id,
//         title: newTaskTitle,
//       });
//       setLists(
//         lists.map((l) =>
//           l._id === list._id
//             ? { ...l, tasks: [...l.tasks, response.data] }
//             : l
//         )
//       );
//       setNewTaskTitle('');
//     } catch (error) {
//       console.error('Error creating task:', error);
//       alert('Error creating task');
//     }
//   };

   
//   const handleDrop = async (e) => {
//     e.preventDefault();
//     const taskId = e.dataTransfer.getData('taskId');
//     const sourceListId = e.dataTransfer.getData('sourceListId');

//     if (sourceListId === list._id) return;

//     try {
//       const response = await axios.put(`${baseurl}/task/task/move`, {
//         taskId,
//         newListId: list._id,
//       });
//       setLists(
//         lists.map((l) => {
//           if (l._id === sourceListId) {
//             return { ...l, tasks: l.tasks.filter((task) => task._id !== taskId) };
//           }
//           if (l._id === list._id) {
//             return { ...l, tasks: [...l.tasks, response.data] };
//           }
//           return l;
//         })
//       );
//     } catch (error) {
//       console.error('Error moving task:', error);
//       alert('Error moving task');
//     }
//   };

//   return (
//     <div
//       className="list bg-white rounded-lg shadow-lg p-4 min-w-[300px] border border-gray-200"
//       onDragOver={(e) => e.preventDefault()}
//       onDrop={handleDrop}
//     >
//       <h2 className="text-xl font-semibold text-gray-700 mb-3 border-b pb-2">
//         {list.title}
//       </h2>

 
//       {list.tasks.map((task) => (
//         <Task
//           key={task._id}
//           task={task}
//           listId={list._id}
//           setLists={setLists}
//           lists={lists}
//         />
//       ))}

     
//       <div className="mt-3">
//         <input
//           type="text"
//           className="border-2 border-gray-300 rounded-lg p-2 w-full mb-2 focus:outline-none focus:ring-2 focus:ring-green-500"
//           placeholder="New Task..."
//           value={newTaskTitle}
//           onChange={(e) => setNewTaskTitle(e.target.value)}
//           onKeyDown={(e) => e.key === 'Enter' && createTask()}
//         />
//         <button
//           className="bg-green-500 text-white rounded-lg p-2 w-full hover:bg-green-600 transition"
//           onClick={createTask}
//         >
//           Add Task
//         </button>
//       </div>
//     </div>
//   );
// };

// export default TaskList;


import React, { useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import Task from './Task';
import baseurl from '../utils/api';

const TaskList = ({ list, setLists, lists }) => {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('medium');
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(list.title);
  const [isUpdatingTitle, setIsUpdatingTitle] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [error, setError] = useState(null);

  // Calculate task statistics
  const taskStats = useMemo(() => {
    const total = list.tasks?.length || 0;
    const byPriority = (list.tasks || []).reduce((acc, task) => {
      acc[task.priority || 'medium'] = (acc[task.priority || 'medium'] || 0) + 1;
      return acc;
    }, {});
    
    return { total, byPriority };
  }, [list.tasks]);

  // Enhanced task creation with validation
  const createTask = useCallback(async () => {
    const trimmedTitle = newTaskTitle.trim();
    const trimmedDescription = newTaskDescription.trim();
    
    if (!trimmedTitle) {
      setError('Please enter a task title');
      return;
    }

    if (trimmedTitle.length > 100) {
      setError('Task title must be 100 characters or less');
      return;
    }

    try {
      setIsCreating(true);
      setError(null);
      
      const response = await axios.post(`${baseurl}/task/task/create`, {
        listId: list._id,
        title: trimmedTitle,
        description: trimmedDescription || undefined,
        priority: newTaskPriority,
      });

      // Optimistic update
      setLists(prevLists =>
        prevLists.map((l) =>
          l._id === list._id
            ? { ...l, tasks: [...(l.tasks || []), response.data] }
            : l
        )
      );

      // Reset form
      setNewTaskTitle('');
      setNewTaskDescription('');
      setNewTaskPriority('medium');
      setShowAddForm(false);
      
    } catch (error) {
      console.error('Error creating task:', error);
      setError('Failed to create task. Please try again.');
    } finally {
      setIsCreating(false);
    }
  }, [newTaskTitle, newTaskDescription, newTaskPriority, list._id, setLists]);

  // Enhanced drag and drop with visual feedback
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragOver(false);
    }
  }, []);

  const handleDrop = useCallback(async (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const taskId = e.dataTransfer.getData('taskId');
    const sourceListId = e.dataTransfer.getData('sourceListId');

    if (sourceListId === list._id || !taskId) return;

    try {
      // Find the task being moved
      const sourceList = lists.find(l => l._id === sourceListId);
      const taskToMove = sourceList?.tasks.find(t => t._id === taskId);
      
      if (!taskToMove) return;

      // Optimistic update
      setLists(prevLists =>
        prevLists.map((l) => {
          if (l._id === sourceListId) {
            return { ...l, tasks: l.tasks.filter((task) => task._id !== taskId) };
          }
          if (l._id === list._id) {
            return { ...l, tasks: [...(l.tasks || []), taskToMove] };
          }
          return l;
        })
      );

      // API call
      await axios.put(`${baseurl}/task/task/move`, {
        taskId,
        newListId: list._id,
      });

    } catch (error) {
      console.error('Error moving task:', error);
      
      // Revert optimistic update
      setLists(lists);
      setError('Failed to move task. Please try again.');
    }
  }, [list._id, lists, setLists]);

  // List title editing
  const handleTitleEdit = useCallback(() => {
    setIsEditingTitle(true);
    setEditedTitle(list.title);
  }, [list.title]);

  const handleTitleSave = useCallback(async () => {
    const trimmedTitle = editedTitle.trim();
    
    if (!trimmedTitle) {
      setError('List title cannot be empty');
      return;
    }

    if (trimmedTitle === list.title) {
      setIsEditingTitle(false);
      return;
    }

    try {
      setIsUpdatingTitle(true);
      
      await axios.put(`${baseurl}/list/list/update`, {
        listId: list._id,
        title: trimmedTitle,
      });

      setLists(prevLists =>
        prevLists.map((l) =>
          l._id === list._id ? { ...l, title: trimmedTitle } : l
        )
      );

      setIsEditingTitle(false);
    } catch (error) {
      console.error('Error updating list title:', error);
      setError('Failed to update list title');
    } finally {
      setIsUpdatingTitle(false);
    }
  }, [editedTitle, list, setLists]);

  const handleTitleCancel = useCallback(() => {
    setIsEditingTitle(false);
    setEditedTitle(list.title);
  }, [list.title]);

  // Delete list functionality
  const handleDeleteList = useCallback(async () => {
    const taskCount = list.tasks?.length || 0;
    const confirmMessage = taskCount > 0 
      ? `Are you sure you want to delete "${list.title}" and its ${taskCount} task(s)?`
      : `Are you sure you want to delete "${list.title}"?`;
      
    if (!window.confirm(confirmMessage)) return;

    try {
      setIsDeleting(true);
      
      // Optimistic update
      setLists(prevLists => prevLists.filter(l => l._id !== list._id));
      
      await axios.delete(`${baseurl}/list/list/delete`, {
        data: { listId: list._id }
      });
      
    } catch (error) {
      console.error('Error deleting list:', error);
      
      // Revert optimistic update
      setLists(lists);
      setError('Failed to delete list');
    } finally {
      setIsDeleting(false);
    }
  }, [list, lists, setLists]);

  // Keyboard shortcuts
  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      if (isEditingTitle) {
        handleTitleSave();
      } else if (showAddForm) {
        createTask();
      }
    } else if (e.key === 'Escape') {
      if (isEditingTitle) {
        handleTitleCancel();
      } else if (showAddForm) {
        setShowAddForm(false);
        setNewTaskTitle('');
        setNewTaskDescription('');
      }
    }
  }, [isEditingTitle, showAddForm, handleTitleSave, handleTitleCancel, createTask]);

  // Clear error after 5 seconds
  React.useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div
      className={`
        list group relative bg-white rounded-xl shadow-lg border-2 transition-all duration-200
        min-w-[320px] max-w-[320px] h-fit
        ${isDragOver ? 'border-blue-400 bg-blue-50 shadow-xl scale-105' : 'border-gray-200'}
        ${isDeleting ? 'opacity-50 pointer-events-none' : ''}
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onKeyDown={handleKeyPress}
    >
      {/* List Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-2">
          {isEditingTitle ? (
            <div className="flex-1 flex items-center space-x-2">
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                onBlur={handleTitleSave}
                className="flex-1 text-xl font-semibold bg-transparent border-b-2 border-blue-400 focus:outline-none"
                maxLength={50}
                autoFocus
                disabled={isUpdatingTitle}
              />
              {isUpdatingTitle && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
              )}
            </div>
          ) : (
            <h2
              className="text-xl font-semibold text-gray-800 cursor-pointer hover:text-gray-600 transition-colors flex-1"
              onClick={handleTitleEdit}
              title="Click to edit"
            >
              {list.title}
            </h2>
          )}

          {/* List actions */}
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
              onClick={handleDeleteList}
              title="Delete list"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Task statistics */}
        {/* <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{taskStats.total} {taskStats.total === 1 ? 'task' : 'tasks'}</span>
          <div className="flex space-x-2">
            {taskStats.byPriority.high && (
              <span className="px-2 py-1 bg-red-100 text-red-600 rounded-full text-xs">
                {taskStats.byPriority.high} high
              </span>
            )}
            {taskStats.byPriority.medium && (
              <span className="px-2 py-1 bg-yellow-100 text-yellow-600 rounded-full text-xs">
                {taskStats.byPriority.medium} med
              </span>
            )}
            {taskStats.byPriority.low && (
              <span className="px-2 py-1 bg-green-100 text-green-600 rounded-full text-xs">
                {taskStats.byPriority.low} low
              </span>
            )}
          </div>
        </div> */}
      </div>

      {/* Error message */}
      {error && (
        <div className="px-4 py-2 bg-red-50 border-b border-red-200">
          <div className="flex items-center justify-between">
            <span className="text-red-700 text-sm">{error}</span>
            <button
              onClick={() => setError(null)}
              className="text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Tasks Container */}
      <div className="p-4 min-h-[200px] max-h-[500px] overflow-y-auto">
        {isDragOver && (
          <div className="border-2 border-dashed border-blue-400 rounded-lg p-4 mb-4 text-center text-blue-600 bg-blue-50">
            <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Drop task here
          </div>
        )}

        {(list.tasks || []).length === 0 && !isDragOver ? (
          <div className="text-center py-8 text-gray-400">
            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v11a2 2 0 002 2h2m0-18h2a2 2 0 012 2v4m6 0V4a2 2 0 00-2-2h-2m0 5.5V16a2 2 0 01-2 2H9" />
            </svg>
            <p>No tasks yet</p>
            <p className="text-sm">Add a task or drag one here</p>
          </div>
        ) : (
          (list.tasks || []).map((task) => (
            <Task
              key={task._id}
              task={task}
              listId={list._id}
              setLists={setLists}
              lists={lists}
            />
          ))
        )}
      </div>
 
      <div className="border-t border-gray-100 p-4">
        {!showAddForm ? (
          <button
            className="w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-green-400 hover:text-green-600 transition-colors"
            onClick={() => setShowAddForm(true)}
          >
            + Add Task
          </button>
        ) : (
          <div className="space-y-3">
            <input
              type="text"
              className="w-full border-2 border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Task title..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              maxLength={100}
              autoFocus
            />
            
            <textarea
              className="w-full border-2 border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
              placeholder="Description (optional)..."
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
              rows={2}
              maxLength={200}
            />

            <select
              className="w-full border-2 border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              value={newTaskPriority}
              onChange={(e) => setNewTaskPriority(e.target.value)}
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>

            <div className="flex space-x-2">
              <button
                className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white rounded-lg p-3 font-medium transition-colors"
                onClick={createTask}
                disabled={isCreating || !newTaskTitle.trim()}
              >
                {isCreating ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </span>
                ) : (
                  'Add Task'
                )}
              </button>
              
              <button
                className="px-4 py-3 border-2 border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => {
                  setShowAddForm(false);
                  setNewTaskTitle('');
                  setNewTaskDescription('');
                  setNewTaskPriority('medium');
                }}
                disabled={isCreating}
              >
                Cancel
              </button>
            </div>

            <div className="text-xs text-gray-500">
              Title: {newTaskTitle.length}/100 • Description: {newTaskDescription.length}/200
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;