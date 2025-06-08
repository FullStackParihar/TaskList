import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    gender: '',
    age: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/user/signup', formData);
      navigate('/verify-otp', { state: { email: formData.email } });
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-indigo-200 px-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-10">
        <h2 className="text-4xl font-extrabold text-center text-indigo-700 mb-8">Create Account</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-5">
          <div>
            <label className="block text-gray-700 text-sm mb-1">Name</label>
            <input
              type="text"
              name="name"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm mb-1">Email</label>
            <input
              type="email"
              name="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm mb-1">Phone</label>
            <input
              type="text"
              name="phone"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm mb-1">Password</label>
            <input
              type="password"
              name="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm mb-1">Gender</label>
            <select
              name="gender"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 text-sm mb-1">Age</label>
            <input
              type="number"
              name="age"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              value={formData.age}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-xl shadow-md transition duration-300"
          >
            Sign Up
          </button>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-500 hover:underline font-medium">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;



// import React, { useState } from 'react';
// import { Eye, EyeOff, Mail, Lock, User, Phone, Calendar, Users, ArrowRight } from 'lucide-react';
// import baseurl from '../utils/api';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
 
// const navigate = useNavigate();
// const Signup = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     password: '',
 
//   });
//   const [error, setError] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
 

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSignup = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post(`${baseurl}/user/signup`, formData);
//       navigate('/verify-otp', { state: { email: formData.email } });

//       console.log('Signup attempt with:', formData);
//     } catch (err) {
//       setError(err.response?.data?.message || 'Signup failed');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
   
//       <div className="absolute inset-0 overflow-hidden">
//         <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
//         <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
//         <div className="absolute top-40 left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
//       </div>

//       <div className="relative bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-lg border border-white/20">
 
//         <div className="text-center mb-8">
//           <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mb-4">
//             <User className="w-8 h-8 text-white" />
//           </div>
//           <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
//           <p className="text-gray-300">Join us today and get started</p>
//         </div>
 
//         {error && (
//           <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
//             <p className="text-red-200 text-sm text-center">{error}</p>
//           </div>
//         )}

//         <div className="space-y-5">
    
//           <div className="relative">
//             <label className="block text-gray-300 text-sm font-medium mb-2">
//               Full Name
//             </label>
//             <div className="relative">
//               <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//               <input
//                 type="text"
//                 name="name"
//                 className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
//                 placeholder="Enter your full name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//           </div>

     
//           <div className="relative">
//             <label className="block text-gray-300 text-sm font-medium mb-2">
//               Email Address
//             </label>
//             <div className="relative">
//               <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//               <input
//                 type="email"
//                 name="email"
//                 className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
//                 placeholder="Enter your email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//           </div>

  
//           <div className="relative">
//             <label className="block text-gray-300 text-sm font-medium mb-2">
//               Phone Number
//             </label>
//             <div className="relative">
//               <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//               <input
//                 type="text"
//                 name="phone"
//                 className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
//                 placeholder="Enter your phone number"
//                 value={formData.phone}
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//           </div>

    
//           <div className="relative">
//             <label className="block text-gray-300 text-sm font-medium mb-2">
//               Password
//             </label>
//             <div className="relative">
//               <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//               <input
//                 type={showPassword ? "text" : "password"}
//                 name="password"
//                 className="w-full pl-12 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
//                 placeholder="Create a password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 required
//               />
//               <button
//                 type="button"
//                 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
//                 onClick={() => setShowPassword(!showPassword)}
//               >
//                 {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//               </button>
//             </div>
//           </div>

      
//           {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         
//             <div className="relative">
//               <label className="block text-gray-300 text-sm font-medium mb-2">
//                 Gender
//               </label>
//               <div className="relative">
//                 <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                 <select
//                   name="gender"
//                   className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm appearance-none cursor-pointer"
//                   value={formData.gender}
//                   onChange={handleChange}
//                   required
//                 >
//                   <option value="" className="bg-gray-800 text-gray-300">Select Gender</option>
//                   <option value="male" className="bg-gray-800 text-white">Male</option>
//                   <option value="female" className="bg-gray-800 text-white">Female</option>
//                   <option value="other" className="bg-gray-800 text-white">Other</option>
//                 </select>
//                 <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
//                   <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                   </svg>
//                 </div>
//               </div>
//             </div>

      
//             <div className="relative">
//               <label className="block text-gray-300 text-sm font-medium mb-2">
//                 Age
//               </label>
//               <div className="relative">
//                 <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                 <input
//                   type="number"
//                   name="age"
//                   className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
//                   placeholder="Age"
//                   value={formData.age}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>
//             </div>
//           </div>
//   */}
//           <button
//             onClick={handleSignup}
//             className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center group mt-6"
//           >
//             Create Account
//             <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
//           </button>
 
//           <div className="text-center mt-6">
//             <p className="text-gray-300">
//               Already have an account?{' '}
             
//               <a href="/login" className="text-indigo-300 hover:text-indigo-200 font-medium transition-colors">
//                 Sign In
//               </a>
             
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Signup;