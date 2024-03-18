import { AiFillCloseCircle } from "react-icons/ai"; 
import React, { useState, useRef, useEffect  } from 'react';
import imagen from '/ChatBot.png'

const ChatBot: React.FC = () => {

  const URL = import.meta.env.VITE_APP_API_URL
  const [isChatboxOpen, setIsChatboxOpen] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [chatMessages, setChatMessages] = useState<{ author: string; message: string; timestamp: string }[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
    }
  }, [chatMessages, isChatboxOpen]);

  const toggleChatbox = () => {
    setIsChatboxOpen(!isChatboxOpen);
  };

  const handleUserInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(event.target.value);
  };

  const handleSendMessage = async () => {
    if (userInput.trim() !== '') {
      const timestamp = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });; 
      setChatMessages(prevMessages => [...prevMessages, { author: 'user', message: userInput, timestamp }]);

      try {
        const response = await fetch(`${URL}/chatbox/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: userInput }),
        });
        if (!response.ok) {
          throw new Error('Failed to send message');
        }

        const data = await response.json();
        respondToUser(data.response);
      } catch (error) {
        console.error('Error sending message:', error);
        // Handle error, e.g., display an error message to the user
      }
      setUserInput('');    
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  const respondToUser = (botResponse: string) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
    setChatMessages(prevMessages => [
      ...prevMessages,
      { author: 'chatbot', message: botResponse, timestamp },
    ]);
  };

  return (
    <div className='text-black'>
      {!isChatboxOpen && (
        <div className="fixed bottom-0 right-0 mb-4 mr-4">
          <button onClick={toggleChatbox} className=" text-white py-2 px-4 rounded-md flex items-center">
            <img src={imagen} alt="ChatBot" className="h-16"/>
          </button>
        </div>
      )}
      {isChatboxOpen && (
        <div className="fixed bottom-6 right-4 w-[22rem]">
          <div className="bg-white shadow-md rounded-lg max-w-lg w-full">
            {/* Chatbox content */}
            {/* Use chatMessages state to render chat messages */}
            <div className="p-4 border-b bg-[#020e42] text-white rounded-t-lg flex justify-between items-center">
              <p className="text-xl font-semibold">ChatBot Gaia</p>
              <button onClick={toggleChatbox} className="text-gray-100 hover:text-gray-300 focus:outline-none focus:text-gray-400">
                <AiFillCloseCircle className="text-2xl"/>
              </button>
            </div>
            <div className="p-4 h-96 overflow-y-auto">
              {chatMessages.map((message, index) => (
                <div key={index} className={`text-sm mb-2 ${message.author === 'user' ? 'text-right' : ''}`}>
                  <p className={`bg-${message.author === 'user' ? 'blue-500' : 'gray-200'} text-${message.author === 'user' ? 'white' : 'gray-700'} rounded-lg py-2 px-4 inline-block`}>{message.message}</p>
                  <br/>
                  <span className="text-xs text-gray-500 leading-none">{message.timestamp}</span>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            <div className="p-4 border-t flex">
              <input
                type="text"
                value={userInput}
                onChange={handleUserInput}
                onKeyDown={handleKeyPress}
                placeholder="Type a message"
                className="w-full px-3 my-[1px] h-[38px] py-1 border rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />              
              <button onClick={handleSendMessage} className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 transition duration-300">
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;