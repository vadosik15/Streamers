const express = require('express');
const mongoose = require('mongoose');
const WebSocket = require('ws');
const cors = require('cors');
const http = require('http');

const app = express();

app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

mongoose
  .connect('mongodb+srv://vadimbratus:12345@cluster0.21uiraz.mongodb.net/steamers?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
    const server = http.createServer(app);
    const wss = new WebSocket.Server({ server });

    wss.on('connection', (ws) => {
      console.log('WebSocket connection established');

      // Send all streamers to the client upon connection
      Streamer.find()
        .then((streamers) => {
          ws.send(JSON.stringify(streamers));
        })
        .catch((error) => {
          console.error('Failed to fetch streamers:', error);
        });
    });

    app.get('/streamers', (req, res) => {
      Streamer.find()
        .then((streamers) => {
          res.json(streamers);
        })
        .catch((error) => {
          res.status(500).json({ error: 'Failed to fetch streamers' });
        });
    });

    app.post('/streamers', (req, res) => {
      const { name, platform, description } = req.body;

      const newStreamer = new Streamer({
        name,
        platform,
        description,
      });

      newStreamer
        .save()
        .then(() => {
          // Broadcast the new streamer to all connected clients
          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify(newStreamer));
            }
          });

          res.status(201).json({ message: 'Streamer message saved successfully' });
        })
        .catch((error) => {
          res.status(500).json({ error: 'Failed to save streamer message' });
        });
    });

    app.get('/streamer/:streamerId', (req, res) => {
      const streamerId = req.params.streamerId;

      Streamer.findById(streamerId)
        .then((streamer) => {
          if (!streamer) {
            res.status(404).json({ error: 'Streamer not found' });
          } else {
            res.json(streamer);
          }
        })
        .catch((error) => {
          res.status(500).json({ error: 'Failed to fetch streamer' });
        });
    });

    app.put('/streamers/:streamerId/vote', (req, res) => {
      const streamerId = req.params.streamerId;
      const { voteType } = req.body;
    
      if (voteType !== 'positive' && voteType !== 'negative') {
        res.status(400).json({ error: 'Invalid vote type' });
        return;
      }
    
      // Check if the user has already voted for this streamer
      const voterId = req.headers.authorization; // Assuming you have an authentication mechanism
      Streamer.findOne({ _id: streamerId, voters: voterId })
        .then((streamer) => {
          if (streamer) {
            res.status(400).json({ error: 'You have already voted for this streamer' });
          } else {
            // Add the voter to the streamer's voters array
            Streamer.findByIdAndUpdate(streamerId, { $push: { voters: voterId } }, { new: true })
              .then((streamer) => {
                if (!streamer) {
                  res.status(404).json({ error: 'Streamer not found' });
                } else {
                  // Update the vote count
                  streamer.votes[voteType]++;
                  return streamer.save();
                }
              })
              .then((updatedStreamer) => {
                // Broadcast the updated streamer to all connected clients
                wss.clients.forEach((client) => {
                  if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(updatedStreamer));
                  }
                });
    
                res.json(updatedStreamer);
              })
              .catch((error) => {
                res.status(500).json({ error: 'Failed to update streamer votes' });
              });
          }
        })
        .catch((error) => {
          res.status(500).json({ error: 'Failed to check voter status' });
        });
    });
    server.listen(8000, () => {
      console.log('Server listening on port 8000');
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

  const streamerSchema = new mongoose.Schema({
    name: String,
    platform: String,
    description: String,
    votes: {
      positive: {
        type: Number,
        default: 0,
      },
      negative: {
        type: Number,
        default: 0,
      },
    },
  });

const Streamer = mongoose.model('Streamer', streamerSchema);
