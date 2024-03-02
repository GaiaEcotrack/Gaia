import React, { useState } from 'react';
import axios from 'axios';

function Chatbox() {
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [botTyping, setBotTyping] = useState(false);

  const sendMessage = () => {
    if (inputMessage.trim() !== '') {
      const newMessage = {
        from: 'user',
        text: inputMessage.trim()
      };
      setMessages([...messages, newMessage]);
      setInputMessage('');
      scrollChat();
      setBotTyping(true);
      console.log(newMessage.text);
      

      axios.post('http://127.0.0.1:5000/chatbox/', { "message": newMessage.text })
        .then(response => {
          setTimeout(() => {
            setBotTyping(false);
            const botResponse = {
              from: 'bot',
              text: response.data.response
            };
            setMessages([...messages, botResponse]);
            scrollChat();
          }, (response.data.response.length / 10) * 1000 + (Math.floor(Math.random() * 2000) + 1500));
        })
        .catch(error => {
          console.error('Error:', error);
          setBotTyping(false);
        });
    }
  };

  const scrollChat = () => {
    const messagesContainer = document.getElementById("messages");
    messagesContainer.scrollTop = messagesContainer.scrollHeight - messagesContainer.clientHeight;
    setTimeout(() => {
      messagesContainer.scrollTop = messagesContainer.scrollHeight - messagesContainer.clientHeight;
    }, 100);
  };

  return (
    <div className="flex-1 p-2 sm:p-6 justify-between flex flex-col h-screen bg-white">
      <div id="messages" className="flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
        {messages.map((message, index) => (
          <div key={index}>
            <div className={`flex items-end ${message.from === 'bot' ? '' : 'justify-end'}`}>
              <div className={`flex flex-col space-y-2 text-md leading-tight max-w-lg mx-2 ${message.from === 'bot' ? 'order-2 items-start' : 'order-1 items-end'}`}>
                <div>
                  <span className={`px-4 py-3 rounded-xl inline-block ${message.from === 'bot' ? 'rounded-bl-none bg-gray-100 text-gray-600' : 'rounded-br-none bg-blue-500 text-white'}`}>{message.text}</span>
                </div>
              </div>
              <img src={message.from === 'bot' ? 'https://cdn.icon-icons.com/icons2/1371/PNG/512/robot02_90810.png' : 'https://i.pravatar.cc/100?img=7'} alt="" className={`w-6 h-6 rounded-full ${message.from === 'bot' ? 'order-1' : 'order-2'}`} />
            </div>
          </div>
        ))}
        {botTyping && (
          <div style={{ display: 'none' }}>
            <div className="flex items-end">
              <div className="flex flex-col space-y-2 text-md leading-tight mx-2 order-2 items-start">
                <div><img src="https://support.signal.org/hc/article_attachments/360016877511/typing-animation-3x.gif" alt="..." className="w-16 ml-6" /></div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="border-t-2 border-gray-200 px-4 pt-4 mb-2 sm:mb-0">
        <div className="relative flex">
          <input type="text" placeholder="Say something..." autoComplete="off" autoFocus={true} className="text-md w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-5 pr-16 bg-gray-100 border-2 border-gray-200 focus:border-blue-500 rounded-full py-2" value={inputMessage} onChange={e => setInputMessage(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()} />
          <div className="absolute right-2 items-center inset-y-0 hidden sm:flex">
            <button type="button" className="inline-flex items-center justify-center rounded-full h-8 w-8 transition duration-200 ease-in-out text-white bg-blue-500 hover:bg-blue-600 focus:outline-none" onClick={sendMessage}>
              <i className="mdi mdi-arrow-right text-xl leading-none"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chatbox;
