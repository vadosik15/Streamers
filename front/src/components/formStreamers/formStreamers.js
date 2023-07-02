import React, { useState } from "react";
import './formStreamer.scss';
import axios from "axios";

export const FormStreamers = () => {
  const [newStreamer, setNewStreamer] = useState({
    name: '',
    platform: '',
    description: '',
  });

  const handleInputChange = (event) => {
    setNewStreamer((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      await axios.post('http://localhost:8000/streamers', newStreamer);
      setNewStreamer({
        name: '',
        platform: '',
        description: '',
      });
    } catch (error) {
      console.error('Failed to save streamer:', error);
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="form">
      <div className="subtitle">Let's add new Streamer!</div>
      <div className="input-container ic1">
        <input
          id="firstname"
          className="input"
          type="text"
          name="name"
          placeholder=" "
          value={newStreamer.name}
          onChange={handleInputChange}
          required />
  
        <div className="cut"></div>
        <label
          for="firstname"
          className="placeholder"
        >
          Nick name</label>
        </div>
        
        <div className="input-container ic2">
        
        <input
          id="lastname"
          className="input"
          type="text"
          name="platform"
          placeholder=" "
          value={newStreamer.platform}
          onChange={handleInputChange}
          required />
  
        <div className="cut"></div>

        <label for="lastname" className="placeholder">Platform</label>
      </div>

      <div className="input-container ic2">
        <input id="email" className="input" type="text"
          name="description"
          
          placeholder=" "
          value={newStreamer.description}
          onChange={handleInputChange}
          required />
        <div className="cut cut-short"></div>
        <label for="email" className="placeholder">Description</ label>
      </div>

      <button type="submit" className="submit">Add Streamer</button>
    </form>
  )
}