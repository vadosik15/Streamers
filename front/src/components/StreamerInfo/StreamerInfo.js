/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './StreamerInfo.scss'

export const StreamerInfo = () => {
  const { id } = useParams();
  const [streamer, setStreamer] = useState(null);

  useEffect(() => {
    fetchStreamer();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchStreamer = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/streamer/${id}`);
      setStreamer(response.data);
    } catch (error) {
      console.error('Failed to fetch streamer:', error);
    }
  };

  if (!streamer) {
    return <div>Loading...</div>;
  }

  return (
    <div className='streamer'>
      <img src='https://static-cdn.jtvnw.net/jtv_user_pictures/asmongold-profile_image-f7ddcbd0332f5d28-300x300.png' />
      <h2>Name: {streamer.name}</h2>
      <h2>Platform: {streamer.platform}</h2>
      <p>Description: {streamer.description}</p>
      <p>Positive Votes: {streamer.votes.positive}</p>
      <p>Negative Votes: {streamer.votes.negative}</p>
    </div>
  );
};