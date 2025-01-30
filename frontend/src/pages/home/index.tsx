import { NextPage } from 'next';
import { useEffect, useRef, useState } from 'react';
import { Socket, io } from 'socket.io-client';

const HomePage: NextPage = () => {
  const [name, setName] = useState('');

  const [localAudioTrack, setLocalAudioTrack] =
    useState<MediaStreamTrack | null>(null);
  const [localVideoTrack, setlocalVideoTrack] =
    useState<MediaStreamTrack | null>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

  const streamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const socketRef = useRef<Socket | null>(null);

  const getCam = async () => {
    const stream = await window.navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    streamRef.current = stream;
    // MediaStream
    const audioTrack = stream.getAudioTracks()[0]; // Out of multiple devices get audio from first one
    const videoTrack = stream.getVideoTracks()[0];
    setLocalAudioTrack(audioTrack);
    setlocalVideoTrack(videoTrack);
    if (!videoRef.current) {
      return;
    }

    videoRef.current.srcObject = new MediaStream([videoTrack]);
    videoRef.current.play();
  };

  useEffect(() => {
    // Initialize camera
    // IIFE:Immediately Invoked Function Expressions
    // (async () => {
    //   if (videoRef && videoRef.current) {
    //     await getCam();
    //   }
    // })();

    if (videoRef && videoRef.current) {
      getCam();
    }

    // Initialize Socket.IO
    if (!socketRef.current) {
      socketRef.current = io('http://localhost:5000', {
        transports: ['websocket'], // Force WebSocket transport
      });

      // Handle socket events
      socketRef.current.on('connect', () => {
        console.log('Connected to Socket.IO server');
      });

      socketRef.current.on('disconnect', () => {
        console.log('Disconnected from Socket.IO server');
      });

      socketRef.current.on('connect_error', (err) => {
        console.error('Socket Connection Error:', err);
      });
    }

    // Cleanup function
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []); // Empty dependency array ensures the effect runs only once

  const handleStreamNow = () => {
    if (!streamRef.current || !socketRef.current?.connected) {
      return;
    }
    console.log('StreamRef and SocketRef defined');
    const mediaRecorder = new MediaRecorder(streamRef.current, {
      audioBitsPerSecond: 128000,
      videoBitsPerSecond: 2500000,
    });

    mediaRecorder.ondataavailable = (ev) => {
      // console.log('Binary Data: ', ev.data);
      socketRef.current?.emit('binaryStream', ev.data);
    };

    mediaRecorder.start(25);
  };

  return (
    <div className={'p-[32px] flex flex-col justify-center items-center'}>
      <p>Home Page</p>
      <video
        className={'relative w-full max-w-[500px] h-[500px] m-auto'}
        ref={videoRef}
        autoPlay
      />
      <label>Twitch Key</label>
      <input type={'text'} />
      <button
        onClick={handleStreamNow}
        className={'px-4 py-2 bg-black text-white rounded'}
      >
        Start Stream
      </button>
    </div>
  );
};

export default HomePage;
