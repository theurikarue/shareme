import React from 'react';
import { Circles } from 'react-loader-spinner'; // Import a valid spinner component

const Spinner = ({ message }) => { // Accept `message` as a prop if needed

  return (
    <div className="flex flex-col justify-center items-center h-full w-full">
      <Circles 
        color="#00BFFF" 
        height={50} 
        width={200} 
        className='m-5'
      />
        <p className="text-lg text-center px-2">
          {message}
        </p>
      
    </div>
  );
}

export default Spinner;
