import React from 'react';

export default function VideoCall({ startCall }) {
  return (
    <div className="video-call">
      <button className="video-call-button" onClick={startCall}>Start Video Call</button>
    </div>
  );
}