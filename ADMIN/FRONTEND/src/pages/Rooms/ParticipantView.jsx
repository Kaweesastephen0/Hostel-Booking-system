import React, { useEffect, useRef } from 'react';
import { MicOff, VideoOff, User } from 'lucide-react';
import './ParticipantView.css';

const ParticipantView = ({ participant }) => {
    const { name, isMuted, isCameraOn, isLocal, stream } = participant;
    const videoRef = useRef(null);

    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);

    return (
        <div className="participant-container">
            {isCameraOn && stream ? (
                <video
                    ref={videoRef}
                    className={`participant-video ${isLocal ? 'local' : ''}`}
                    autoPlay
                    playsInline
                    muted={isLocal} 
                />
            ) : (
                <div className="video-placeholder">
                    <User size={48} className="placeholder-icon" />
                    {!isCameraOn && <VideoOff size={24} className="camera-off-icon" />}
                </div>
            )}
            <div className="participant-info">
                <span>{name}</span>
                {isMuted && <MicOff size={16} className="mic-muted-icon" />}
            </div>
        </div>
    );
};

export default ParticipantView;