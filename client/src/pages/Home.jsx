import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client'
import axios from "axios";
import { useNavigate } from "react-router-dom";

const socket = io("http://localhost:3001")

export default function Home() {
    const [message, setMessage] = useState('');
    const [leftChat, leftSetChat] = useState([]);
    const [rightChat, rightSetChat] = useState([]);
    const chatEndRef = useRef(null);
    const [username, setUsername] = useState('');
    const [left, setLeft] = useState('')

    const navigate = useNavigate()

    useEffect(() => {
        axios.defaults.withCredentials = true
        axios.get('http://localhost:3001/home')
            .then(res => {
                if (!res.data.valid) {
                    navigate('/')
                }
            })
            .catch(err => {
                console.log("Home page ma error che." + err)
                navigate("/");
            })
    }, [])


    useEffect(() => {
        socket.on('receive', (chatMessage) => {
            leftSetChat((prevChat) => [...prevChat, chatMessage]);
        })
        socket.on('name', (newUsername) => {
            setUsername(newUsername)
        });

        socket.on('user-disconnected', (username) => {
            setLeft(username)
        });

        return () => {
            socket.off('receive');
            socket.off('sendName');
            socket.off('user-disconnected');
        }
    }, [])

    useEffect(() => {

        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [leftChat, rightChat]);


    const handleSendMessage = () => {
        socket.emit('input', message);
        socket.emit('sendName', "ronil");
        rightSetChat((prevChat) => [...prevChat, message])
        setMessage('');
    };



    // console.log("right Chat :", rightChat)
    // console.log("left Chat :", leftChat)
    return (
        <div className="min-h-screen flex flex-col bg-[#111b21] text-white">
            <div className="p-4 bg-[#202c33] shadow-lg fixed top-0 w-full">
                <h1 className="text-2xl font-bold">Chat App</h1>
            </div>


            <div className="flex-1 overflow-y-auto mt-14 p-5">
                {/* Receiver Message (Left Side) */}
                {leftChat.map((message, index) => (
                    <div className="flex justify-start mb-4">
                        <div className="bg-[#202c33] p-4 rounded-lg max-w-[70%]">
                            <p className="text-white" key={index}>{username} : {message}</p>
                            <span className="text-xs text-gray-400">10:00 AM</span>
                        </div>
                    </div>
                ))}

                {left ? <div className="flex justify-start mb-4">
                    <div className="bg-[#362322] p-4 rounded-lg max-w-[70%]">
                        <p className="text-white">{username} : Has been Left</p>
                        <span className="text-xs text-gray-400">10:00 AM</span>
                    </div>
                </div> : ''}


                {/* Sender Message (Right Side) */}
                {rightChat.map((message, index) => (
                    <div className="flex justify-end mb-4">
                        <div className="bg-[#005c4b] p-4 rounded-lg max-w-[70%]">
                            <p className="text-white" key={index}>{message}</p>
                            <span className="text-xs text-gray-300">10:01 AM</span>
                        </div>
                    </div>
                ))}

            </div>

            {/* Chat Input Box */}
            <div className="p-4 bg-[#202c33] fixed bottom-0 w-full">
                <div className="flex items-center">
                    <input
                        placeholder="Type a message..."
                        className="flex-1 p-3 rounded-lg bg-[#2a3942] text-white placeholder-gray-400 focus:outline-none"
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <button onClick={handleSendMessage} className="ml-4 px-6 py-3 bg-[#008069] rounded-lg hover:bg-[#025e4b] transition-colors">
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}

// import React, { useState, useEffect } from 'react';
// import { io } from 'socket.io-client';

// const socket = io("http://localhost:3000")

// export default function Home() {
//     const [message, setMessage] = useState('');
//     const [chat, setChat] = useState([]);
//     const [username, setUsername] = useState('');

//     useEffect(() => {
//         socket.on('sendMessage', (chatMessage) => {
//             setMessage((prevChat) => [...prevChat, chatMessage]);
//         });

//         socket.on('sendName', (newUsername) => {
//             console.log(`Username set to ${newUsername}`);
//         });

//         socket.on('user-disconnected', (username) => {
//             console.log(`${username} has disconnected`);
//         });

//         return () => {
//             socket.off('sendMessage');
//             socket.off('sendName');
//             socket.off('user-disconnected');
//         };
//     }, []);

//     const handleSendMessage = () => {
//         if (message.trim()) {
//             socket.emit('sendMessage', { username, message });
//             setMessage('');
//             setUsername('')
//         }
//     };

//     const handleSetUsername = () => {
//         if (username.trim()) {
//             socket.emit('sendName', username);
//         }
//     };
//     return (
//         <div className="min-h-screen flex flex-col bg-[#111b21] text-white">
//             <div className="p-4 bg-[#202c33] shadow-lg">
//                 <h1 className="text-2xl font-bold">Chat App</h1>
//                 <div>
//                     <input
//                         className="bg-[#2a3942] p-2 rounded-lg"
//                         type="text"
//                         placeholder="Enter your username"
//                         value={username}
//                         onChange={(e) => setUsername(e.target.value)}
//                     />
//                     <button onClick={handleSetUsername} className="ml-2 px-4 py-2 bg-[#008069] rounded-lg">
//                         Set Username
//                     </button>
//                 </div>
//             </div>

//             <div className="flex-1 p-6 overflow-y-auto">
//                 {/* Display messages dynamically */}
//                 {chat.map((chatMessage, index) => (
//                     <div key={index} className={`flex mb-4 ${chatMessage.username === username ? 'justify-end' : 'justify-start'}`}>
//                         <div
//                             className={`p-4 rounded-lg max-w-[70%] ${chatMessage.username === username ? 'bg-[#005c4b]' : 'bg-[#202c33]'
//                                 }`}
//                         >
//                             <p className="text-white">{chatMessage.message}</p>
//                             <span className="text-xs text-gray-400">{chatMessage.username}</span>
//                         </div>
//                     </div>
//                 ))}
//             </div>

//             {/* Chat Input Box */}
//             <div className="p-4 bg-[#202c33]">
//                 <div className="flex items-center">
//                     <input
//                         placeholder="Type a message..."
//                         className="flex-1 p-3 rounded-lg bg-[#2a3942] text-white placeholder-gray-400 focus:outline-none"
//                         type="text"
//                         value={message}
//                         onChange={(e) => setMessage(e.target.value)}
//                     />
//                     <button onClick={handleSendMessage} className="ml-4 px-6 py-3 bg-[#008069] rounded-lg hover:bg-[#025e4b] transition-colors">
//                         Send
//                     </button>
//                 </div>
//             </div>
//         </div>

//     );
// }
