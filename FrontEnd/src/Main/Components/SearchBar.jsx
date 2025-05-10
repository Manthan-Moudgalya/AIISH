import React from 'react';

const SearchBar = () => (
  <div className="flex justify-center mt-10 px-4">
    <input 
      type="text" 
      placeholder="Ask your AI health assistant..." 
      className="w-full max-w-2xl px-4 py-3 border rounded-full shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
  </div>
);

export default SearchBar;


// import React from 'react'

// const SearchBar= () => {
//     return (
//         <div className="w-{100%} mx-auto my-8">
//           <input
//             type="text"
//             placeholder="Chat with AI Bot..."
//             className="w-full p-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>
//       );
// }
// export default SearchBar;