// import React from 'react';

// const SearchArts = (props) => {
//   const handleChange = (e) => {
//     props.searchValue(e.target.value); 
//   };

//   return (
//     <form method='POST' onSubmit={(e) => e.preventDefault()} name='formName' className='center'>
//       <label style={{ fontWeight: 'bold' }}>
//         <span>Search Arts: </span>
//         <input autoComplete='off' type='text' name='searchTerm' onChange={handleChange} />
//       </label>
//     </form>
//   );
// };

// export default SearchArts;


import React from 'react';

const SearchArts = (props) => {
  const handleSubmit = (e) => {
    e.preventDefault(); 
    
    props.searchValue(e.target.searchTerm.value);
  };

  return (
    <form onSubmit={handleSubmit} name='formName' className='center'>
      <label style={{ fontWeight: 'bold' }}>
        <span>Search Arts: </span>
        <input autoComplete='off' type='text' name='searchTerm' />
      </label>
    </form>
  );
};

export default SearchArts;
