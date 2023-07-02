import React, { useEffect, useState } from 'react';
import './listOfStreamers.scss'
import axios from 'axios';
import { Link } from 'react-router-dom';
import dislikeImg from '../images/dislike.png'
import likeImg from '../images/like.png'


export const ListOfStreamers = () => {

  const [streamers, setStreamers] = useState([]);
  const [votedStreamers, setVotedStreamers] = useState([]);
  const hasVoted = (streamerId) => {
    return votedStreamers.includes(streamerId);
  };

  useEffect(() => {
    connectWebSocket();
    fetchStreamers();
  }, []);

  const connectWebSocket = () => {
    const socket = new WebSocket('ws://localhost:8000');

    socket.onopen = () => {
      console.log('WebSocket connection established');
    };

    socket.onmessage = (event) => {
      const updatedStreamer = JSON.parse(event.data);
      setStreamers((prevStreamers) => {
        const existingIndex = prevStreamers.findIndex(
          (streamer) => streamer._id === updatedStreamer._id
        );
        if (existingIndex !== -1) {
          prevStreamers[existingIndex] = updatedStreamer;
          return [...prevStreamers];
        } else {
          return [...prevStreamers, updatedStreamer];
        }
      });
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };
  };

  const fetchStreamers = async () => {
    try {
      const response = await axios.get('http://localhost:8000/streamers');
      setStreamers(response.data);
    } catch (error) {
      console.error('Failed to fetch streamers:', error);
    }
  };

  const handleVote = async (streamerId, voteType) => {
    if (hasVoted(streamerId)) {
      console.log('You have already voted for this streamer.');
      return;
    }

    try {
      await axios.put(`http://localhost:8000/streamers/${streamerId}/vote`, { voteType }, { headers: { Authorization: 'user123' } });
      setVotedStreamers((prevVotedStreamers) => [...prevVotedStreamers, streamerId]);
    } catch (error) {
      console.error('Failed to vote:', error);
    }
  };

  const handlePositiveVote = (streamerId) => {
    handleVote(streamerId, 'positive');
  };

  const handleNegativeVote = (streamerId) => {
    handleVote(streamerId, 'negative');
  };

  return (
    <ul className='list-streamers'>
      {streamers.map((streamer) => (
        <li className='streamer-point' key={streamer._id}>
          <img className='streamer-point__image' src='https://static-cdn.jtvnw.net/jtv_user_pictures/asmongold-profile_image-f7ddcbd0332f5d28-300x300.png' alt="streamer" />
          <Link to={`/streamer/${streamer._id}`}>
          <h3 className='streamer-nick'>{streamer.name}</h3>
          </Link>
          <div className='voute'>
            <p>{streamer.votes && streamer.votes.positive}</p>
            <img className='voute-img' src={likeImg} onClick={() => handlePositiveVote(streamer._id)} alt="positive" />
          </div>
          <div className='voute' >
            <p>{streamer.votes && streamer.votes.negative}</p>
            <img className='voute-img' src={dislikeImg} onClick={() => handleNegativeVote(streamer._id)} alt="negative" />
          </div>
        </li>
      ))}
    </ul>
  )
}