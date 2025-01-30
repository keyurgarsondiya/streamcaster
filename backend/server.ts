import express from 'express';
import { createServer } from 'http';
import { spawn } from 'child_process';
import { Server } from 'socket.io';

const app = express();

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
  },
});

const YOUTUBE_STREAM_KEY = 'your-youtube-stream-key';
const TWITCH_STREAM_KEY = 'live_1242497710_TbeX5eJik9V2QauBoWO6Vc9ocESSoH';
const RTMP_YOUTUBE_URL = `rtmp://a.rtmp.youtube.com/live2/${YOUTUBE_STREAM_KEY}`;
const RTMP_TWITCH_URL = `rtmp://live.twitch.tv/app/${TWITCH_STREAM_KEY}`;

const options = [
  '-i',
  '-',
  '-c:v',
  'libx264',
  '-preset',
  'ultrafast',
  '-tune',
  'zerolatency',
  '-r',
  `${25}`,
  '-g',
  `${25 * 2}`,
  '-keyint_min',
  `${25}`,
  '-crf',
  '25',
  '-pix_fmt',
  'yuv420p',
  '-sc_threshold',
  '0',
  '-profile:v',
  'main',
  '-level',
  '3.1',
  '-c:a',
  'aac',
  '-b:a',
  '128k',
  '-ar',
  `${128000 / 4}`,
  '-f',
  'flv',
  RTMP_TWITCH_URL,
];

const ffmpegProcess = spawn('ffmpeg', options);

io.on('connection', (socket) => {
  console.log('Connection Established ', socket.id);

  socket.on('binaryStream', (chunk: Buffer) => {
    console.log('Incoming Binary Stream');
    ffmpegProcess.stdin.write(chunk); // Pipe the binary data to FFmpeg
  });

  socket.on('disconnect', () => {
    console.log('Socket Disconnected:', socket.id);
    ffmpegProcess.stdin.end(); // Stop sending data to FFmpeg
  });
});

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

httpServer.listen(PORT);
