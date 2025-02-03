import express from 'express';
import { createServer } from 'http';
import { spawn } from 'child_process';
import { Server } from 'socket.io';
import { StreamMetaData } from './types/stream-meta-data';
import { Platform } from './constants/platform.js';

const app = express();

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
  },
});
const streamMetadataMap = new Map<string, StreamMetaData>(); // Map to store metadata per socket
const ffmpegProcesses = new Map<string, any>(); // Store FFmpeg processes per socket

const RTMP_YOUTUBE_URL = `rtmp://a.rtmp.youtube.com/live2/`;
const RTMP_TWITCH_URL = `rtmp://live.twitch.tv/app/`;

const cleanupProcess = async (socketId: string) => {
  const process = ffmpegProcesses.get(socketId);
  if (process) {
    return new Promise<void>((resolve) => {
      try {
        if (process.stdin && !process.stdin.destroyed) {
          process.stdin.end();
        }

        // Force kill after 5 seconds if normal termination doesn't work
        const forceKillTimeout = setTimeout(() => {
          try {
            process.kill('SIGKILL');
          } catch (err) {
            console.error('Force kill failed:', err);
          }
          resolve();
        }, 5000);

        process.on('exit', () => {
          clearTimeout(forceKillTimeout);
          resolve();
        });

        process.kill('SIGTERM');
      } catch (err) {
        console.error('Error during process cleanup:', err);
        resolve();
      }
    });
  }
};

const createFfmpegProcess = (rtmpUrl: string) => {
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
    '25',
    '-g',
    '50',
    '-keyint_min',
    '25',
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
    '32000',
    '-f',
    'flv',
    rtmpUrl,
  ];

  const process = spawn('ffmpeg', options);

  process.stderr.on('data', (data) => {
    console.log(`FFmpeg Log: ${data.toString()}`);
  });

  process.on('close', (code) => {
    console.log(`FFmpeg process exited with code ${code}`);
  });

  process.on('error', (err) => {
    console.error('FFmpeg process error:', err);
  });

  return process;
};

io.on('connection', (socket) => {
  console.log('Connection Established ', socket.id);

  // Listen for binary data
  socket.on('binaryStream', (chunk: Buffer) => {
    console.log('Incoming Binary Stream:', chunk.length, 'bytes');
    const ffmpegProcess = ffmpegProcesses.get(socket.id);
    if (
      ffmpegProcess &&
      ffmpegProcess.stdin &&
      !ffmpegProcess.stdin.destroyed
    ) {
      try {
        ffmpegProcess.stdin.write(chunk);
      } catch (err) {
        console.error('Error writing to FFmpeg process:', err);
        cleanupProcess(socket.id);
        ffmpegProcesses.delete(socket.id);
      }
    } else {
      console.error('FFmpeg process is not running or stdin is destroyed');
    }
  });

  // Listen for stream metadata
  socket.on('streamMetaData', async (metadata: StreamMetaData) => {
    console.log('Received Stream Metadata:', metadata);

    // Clean up any existing process first
    await cleanupProcess(socket.id);
    ffmpegProcesses.delete(socket.id);

    // Determine RTMP URL based on platform
    let rtmpUrl = '';
    if (metadata.platform === Platform.Twitch) {
      rtmpUrl = RTMP_TWITCH_URL + metadata.streamKey;
    } else if (metadata.platform === Platform.Youtube) {
      rtmpUrl = RTMP_YOUTUBE_URL + metadata.streamKey;
    } else {
      console.error('Invalid platform selected');
      return;
    }

    // // Kill existing FFmpeg process for this socket if it exists
    // const existingProcess = ffmpegProcesses.get(socket.id);
    // if (existingProcess) {
    //   existingProcess.kill();
    //   ffmpegProcesses.delete(socket.id);
    // }

    // Create new FFmpeg process
    const ffmpegProcess = createFfmpegProcess(rtmpUrl);
    ffmpegProcesses.set(socket.id, ffmpegProcess);
    streamMetadataMap.set(socket.id, metadata);

    console.log(`New FFmpeg process created for socket ${socket.id}`);
  });

  socket.on('disconnect', () => {
    console.log('Socket Disconnected:', socket.id);
    const ffmpegProcess = ffmpegProcesses.get(socket.id);
    if (ffmpegProcess) {
      if (ffmpegProcess.stdin && !ffmpegProcess.stdin.destroyed) {
        ffmpegProcess.stdin.end();
      }
      ffmpegProcess.kill();
      ffmpegProcesses.delete(socket.id);
    }

    streamMetadataMap.delete(socket.id);
  });
});

process.on('SIGTERM', async () => {
  console.log('Server shutting down...');
  for (const socketId of ffmpegProcesses.keys()) {
    await cleanupProcess(socketId);
  }
  ffmpegProcesses.clear();
  process.exit(0);
});

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

httpServer.listen(PORT);
