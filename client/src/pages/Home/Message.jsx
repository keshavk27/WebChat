import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

function Message({ mssgDetails }) {
  const mssgRef = useRef(null);
  const { selectedUser, userprofile } = useSelector(state => state.userSlice);

  const isSentByCurrentUser = userprofile?.profile?._id === mssgDetails?.senderId;
  const formattedTime = new Date(mssgDetails?.createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  useEffect(() => {
    if (mssgRef.current) {
      mssgRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const renderMessageContent = () => {
    const { message, messageType, fileName } = mssgDetails;
    console.log(messageType)

    switch (messageType) {
      case 'image':
        return (
          <img
            src={message}
            alt="sent"
            className="max-w-xs max-h-60 object-cover rounded-lg"
          />
        );

      case 'video':
        return (
          <video
            src={message}
            controls
            className="max-w-xs max-h-60 rounded-lg"
          >
            Your browser does not support the video tag.
          </video>
        );

      case 'file':
        const ext = fileName?.split('.').pop()?.toLowerCase();
        const isPDF = ext === 'pdf';
        const icon = isPDF ? '📄' : '📎';
        return (
          <a
            href={message}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline break-all"
          >
            {icon} {fileName || 'Download File'}
          </a>
        );

      case 'text':
      default:
        return <span>{message}</span>;
    }
  };

  return (
    <div
      ref={mssgRef}
      className={`chat ${isSentByCurrentUser ? 'chat-end' : 'chat-start'}`}
    >
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <img alt="User avatar" src={selectedUser?.avatar} />
        </div>
      </div>

      <div className="chat-bubble max-w-xs">{renderMessageContent()}</div>

      <div className="chat-footer opacity-50">
        <time className="text-xs">{formattedTime}</time>
      </div>
    </div>
  );
}

export default Message;
