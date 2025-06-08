// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate, Link } from 'react-router-dom';

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post('http://localhost:5000/user/login', {
//         email,
//         password,
//       });
//       localStorage.setItem('token', response.data.token);
//       navigate('/');
//     } catch (err) {
//       setError(err.response?.data?.message || 'Login failed');
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
//         <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Login</h2>
//         {error && <p className="text-red-500 text-center mb-4">{error}</p>}
//         <div className="space-y-4">
//           <div>
//             <label className="block text-gray-700">Email</label>
//             <input
//               type="email"
//               className="w-full p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-gray-700">Password</label>
//             <input
//               type="password"
//               className="w-full p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//           </div>
//           <button
//             className="w-full bg-blue-500 text-white rounded-lg p-2 hover:bg-blue-600 transition"
//             onClick={handleLogin}
//           >
//             Login
//           </button>
//           <p className="text-center text-gray-600">
//             Don't have an account?{' '}
//             <Link to="/signup" className="text-blue-500 hover:underline">
//               Sign Up
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;
 

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import baseurl from '../utils/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${baseurl}/user/login`, {
        email,
        password,
      });
      localStorage.setItem('token', response.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-300 via-purple-300 to-pink-300 px-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-10">
        <h2 className="text-4xl font-extrabold text-center text-indigo-700 mb-8">Welcome Back</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-center text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-gray-700 text-sm mb-2">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm mb-2">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-xl font-semibold shadow-md transition duration-300"
          >
            Login
          </button>

          <p className="text-center text-sm text-gray-600">
            Don’t have an account?{' '}
            <Link to="/signup" className="text-indigo-500 hover:underline font-medium">
              Sign Up 
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
