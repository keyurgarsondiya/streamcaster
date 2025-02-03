import { NextPage } from 'next';
import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { Platform } from '@/constants';
import { StreamMetaData } from '@/types';

const HomePage: NextPage = () => {
  const [micEnabled, setMicEnabled] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(
    null,
  );
  const [streamKey, setStreamKey] = useState('');
  const [streamTitle, setStreamTitle] = useState('');
  const [description, setDescription] = useState('');

  const [localAudioTrack, setLocalAudioTrack] =
    useState<MediaStreamTrack | null>(null);
  const [localVideoTrack, setlocalVideoTrack] =
    useState<MediaStreamTrack | null>(null);

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
  }, []);

  const handleStreamNow = () => {
    if (!streamRef.current || !socketRef.current?.connected) {
      return;
    }
    socketRef.current.emit('streamMetaData', {
      platform: selectedPlatform,
      streamKey,
      streamTitle,
      description,
    } as StreamMetaData);

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

  const toggleMic = () => {
    if (!streamRef.current) return;
    streamRef.current
      .getAudioTracks()
      .forEach((track) => (track.enabled = !micEnabled));
    setMicEnabled(!micEnabled);
  };

  const toggleCamera = () => {
    if (!streamRef.current) return;
    streamRef.current
      .getVideoTracks()
      .forEach((track) => (track.enabled = !cameraEnabled));
    setCameraEnabled(!cameraEnabled);
  };

  const toggleScreenShare = async () => {
    if (!screenSharing) {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      if (videoRef.current) videoRef.current.srcObject = screenStream;
      setScreenSharing(true);
    } else {
      getCam();
      setScreenSharing(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Main Content */}
      <div className="w-3/4 p-6">
        <h1 className="text-2xl font-bold">Live Stream</h1>

        {/* Control Buttons at the Top */}
        <div className="flex justify-end space-x-4 mt-4">
          <button
            onClick={toggleMic}
            className={`px-4 py-2 rounded ${micEnabled ? 'bg-gray-200' : 'bg-red-500 text-white'}`}
          >
            🎤 {micEnabled ? 'Mic' : 'Mic Off'}
          </button>
          <button
            onClick={toggleCamera}
            className={`px-4 py-2 rounded ${cameraEnabled ? 'bg-gray-200' : 'bg-red-500 text-white'}`}
          >
            📷 {cameraEnabled ? 'Camera' : 'Camera Off'}
          </button>
          <button
            onClick={toggleScreenShare}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            🖥 {screenSharing ? 'Stop Sharing' : 'Screen'}
          </button>
          <button
            onClick={handleStreamNow}
            className="px-4 py-2 bg-black text-white rounded"
          >
            🚀 Go Live
          </button>
        </div>

        {/* Video Preview */}
        <div className="w-full h-[400px] bg-gray-800 flex items-center justify-center rounded-lg mt-4">
          <video ref={videoRef} autoPlay className="w-full h-full rounded-lg" />
        </div>

        {/* Stream Settings & Platform Selection */}
        <div className="grid grid-cols-2 gap-6 mt-4">
          {/* Stream Settings */}
          <div>
            <h2 className="text-lg font-semibold">Stream Settings</h2>
            <input
              type="text"
              placeholder="Enter stream title..."
              className="w-full p-2 border rounded mt-2"
              value={streamTitle}
              onChange={(e) => setStreamTitle(e.target.value)}
            />
            <textarea
              placeholder="Enter stream description..."
              className="w-full p-2 border rounded mt-2"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Select Streaming Platform */}
          <div>
            <h2 className="text-lg font-semibold">Select Streaming Platform</h2>
            <div className="flex items-center mt-2">
              <input
                type="radio"
                id="twitch"
                name="platform"
                onChange={() => setSelectedPlatform(Platform.Twitch)}
                className="mr-2"
              />
              <label
                htmlFor="twitch"
                className="cursor-pointer flex items-center"
              >
                <img
                  src="/assets/twitch-logo.png"
                  alt="Twitch"
                  className="w-6 h-6"
                />
                <span className="ml-2">Twitch</span>
              </label>
            </div>

            <div className="flex items-center mt-2">
              <input
                type="radio"
                id="youtube"
                name="platform"
                onChange={() => setSelectedPlatform(Platform.Youtube)}
                className="mr-2"
              />
              <label
                htmlFor="youtube"
                className="cursor-pointer flex items-center"
              >
                <img
                  src="/assets/youtube-logo.png"
                  alt="YouTube"
                  className="w-6 h-6"
                />
                <span className="ml-2">YouTube</span>
              </label>
            </div>

            <input
              type="text"
              placeholder="Enter stream key..."
              className="w-full p-2 border rounded mt-2"
              value={streamKey}
              onChange={(e) => setStreamKey(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Chat Sidebar */}
      <div className="w-1/4 p-6 bg-white border-l">
        <h2 className="text-lg font-semibold">Chat</h2>
        <div className="h-64 bg-gray-100 rounded p-2 overflow-y-auto">
          <p>
            <b>User123:</b> Hello everyone!
          </p>
        </div>
        <input
          type="text"
          className="w-full p-2 border rounded mt-2"
          placeholder="Type a message..."
        />
        <button className="w-full mt-2 px-4 py-2 bg-black text-white rounded">
          Send
        </button>

        {/* Stream Info */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold">Stream Info</h2>
          <p>
            📊 Viewers: <b>0</b>
          </p>
          <p>
            ⏳ Duration: <b>00:00:00</b>
          </p>
          <p>
            🎥 Quality: <b>1080p</b>
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
