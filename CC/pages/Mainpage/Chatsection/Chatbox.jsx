import { useState, useEffect, useRef } from 'react';
import { socket } from '../../../src/socket';
import '../../../src/Css/Mainpage/Chatsection/Chatbox.css';
import { IoMdSend } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";

function Chatbox({ username, room, userId, openChat, setOpenChat}) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const currentUsername = username || localStorage.getItem('username') || 'Anonymous';
  const currentUserId = userId || localStorage.getItem('userId');
  const currentRoom = room || localStorage.getItem('currentroom') || 'Dev Circle';
  const mobile = window.innerWidth <= 768;
  const [isVisible, setIsVisible] = useState(window.innerWidth > 768);
  const messagesEndRef = useRef(null);
  
  useEffect(() => {
    if (openChat) setAnimation('slide-in');
  }, [openChat]);

   useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

 useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };
    window.addEventListener('resize', handleResize);
    // Set initial state
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // // Fetch room list
  // useEffect(() => {
  //   if (!socket) return;

  //   socket.on('room_list', (rooms) => {
  //     // Always include the default room
  //     setRoomList(rooms.includes(DEFAULT_ROOM) ? rooms : [DEFAULT_ROOM, ...rooms]);
  //   });
  //   return () => {
  //     socket.off('room_list');
  //   };
  // }, [socket]);

  // Join room and set up listeners
  useEffect(() => {
    if (!socket || !currentRoom) return;

    setMessages([]);
    
    socket.emit('join_room', currentRoom);

    const handleLoadMessages = (loadedMessages) => setMessages(loadedMessages);
    const handleReceiveMessage = (data) => setMessages((prev) => [...prev, data]);

    socket.on('load_messages', handleLoadMessages);
    socket.on('receive_message', handleReceiveMessage);

    return () => {
      socket.off('load_messages', handleLoadMessages);
      socket.off('receive_message', handleReceiveMessage);
    };
  }, [currentRoom]);

  //const handleMobileVisibility = () => {
  //  if(mobile) {
  //    setIsVisible(false);
  //  }
  //  else {
  //    setIsVisible(true);
  //  }
  //}
//
  
  
  const sendMessage = () => {
    if (message.trim() !== '' && socket) {
      const messageData = {
        username: currentUsername,
        content: message,
        timestamp: new Date().toISOString(),
        room: currentRoom,
        userId: currentUserId,
      };
      socket.emit('send_message', messageData);
      setMessage('');
    }
  };

  const [animation, setAnimation] = useState('slide-in');
  const handleClose = () => {
    setAnimation('slide-out');
    setTimeout(() => setOpenChat(false), 400); // 400ms matches animation duration
  };


 if (mobile && !openChat && animation !== 'slide-out') return null;
  return (

   <div className={`Chatbox-main-layout ${animation}`}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div className="Chatbox-header">
        <IoIosArrowBack className="back-logo" onClick={handleClose} />
          <p><b>Group Chat - {currentRoom}</b></p>
        </div>

        <div className="Chatbox-body">
          <div className="Chat-content">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`chat-message ${
                  (msg.user_id == userId || msg.userId == userId) ? 'chat-message-self' : 'chat-message-other'
                }`}
              >
                <div className="chat-bubble">
                  <p className="chat-username">
                    <b>{msg.username}</b>
                    <span className="chat-timestamp">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </span>
                  </p>
                  <p className="chat-text">{msg.content}</p>
                </div>
              </div>
            ))}
             <div ref={messagesEndRef} />
            </div>
        </div>
        <div className="Chatbox-input">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            onKeyDown={(e) => {
              if (e.key === 'Enter') sendMessage();
            }}
          />
          <IoMdSend className="send-logo" onClick={sendMessage} />
        </div>
      </div>
    </div>
  );
}

export default Chatbox;