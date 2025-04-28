import React from 'react';
import { Routes, Route } from 'react-router-dom';
import IDCreater from '../components/IDCreater';
import Room from '../components/Room';

const Collaborate = () => {
  return (
    <div className='flex justify-evenly'>
      <Routes>
        <Route path="/" element={<IDCreater />} />
        <Route path="room/:roomID" element={<Room />} />
      </Routes>
    </div>
  );
};

export default Collaborate;
