import React from 'react';

const SearchArts = (props) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    
   
    const searchTerm = e.target.searchTerm.value.trim();

    if (searchTerm !== '') {
      props.searchValue(searchTerm);
    }
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
