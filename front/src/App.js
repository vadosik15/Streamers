import React from 'react';
import { Home } from './components/home/Home';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { StreamerInfo } from './components/StreamerInfo/StreamerInfo';
import './App.scss';

const StreamersComponent = () => {
  return (
    <Router>
      <div className='main'>
        <h1>Streamers</h1>
        <div className='main-container'>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/streamer/:id' element={<StreamerInfo />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default StreamersComponent;
