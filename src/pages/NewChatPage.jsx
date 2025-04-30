"use client";

import { useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
import { useNavigate, useLocation } from "react-router-dom";
import { ChatMessage, InputArea } from "../components/Chat/NewChat/NewChatComponents";
import instance from "../utils/axios";
const axios = instance;
const SOCKET_URL = "https://shikhbo-backend.onrender.com";
import { useContext } from "react";
import { AuthContext } from "../context/UserContext";
import { useParams } from "react-router-dom";

function NewChatPage() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [chatId, setChatId] = useState(null);
  const [chatName, setChatName] = useState(null);
  const [shouldNavigate, setShouldNavigate] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id: paramChatId } = useParams();
  const location = useLocation();
  const pendingQueryProcessed = useRef(false);
  const fileInputRef = useRef(null);
  const optimisticMessageSent = useRef(false); // Track if an optimistic message was sent
  
  // Keep a reference to the full message history
  const messagesRef = useRef([]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  // Handle direct submission from ChatModal when arriving at /new
  useEffect(() => {
    if (location.pathname === "/new" && !pendingQueryProcessed.current) {
      const pendingQuery = localStorage.getItem('chatModalQuery');
      const isPending = localStorage.getItem('chatModalPending') === 'true';
      
      if (pendingQuery && isPending && socketRef.current && socketRef.current.connected) {
        pendingQueryProcessed.current = true; // Mark as processed to prevent duplicate submissions
        optimisticMessageSent.current = true; // Mark that we've sent an optimistic message
        
        // Submit the query directly without showing in input field
        submitQueryDirectly(pendingQuery);
        
        // Display optimistic user message immediately
        const newUserMessage = {
          id: Date.now().toString(), // Use string ID for better comparison
          content: pendingQuery,
          role: "user",
          chatId: null,
          timestamp: new Date().toISOString(),
          sender: "user"
        };
       
        setMessages([newUserMessage]);
        messagesRef.current = [newUserMessage];
        
        // Clear the pending query from localStorage
        localStorage.removeItem('chatModalQuery');
        localStorage.removeItem('chatModalPending');
      }
    }
  }, [location.pathname, socketRef.current?.connected]);
  
  // This function handles direct submission from ChatModal
  const submitQueryDirectly = (query) => {
    if (!query.trim()) return;
    
    setIsTyping(true);
    
    // Emit startChat event since this will always be a new chat
    socketRef.current.emit("startChat", { 
      prompt: query, 
      userId: currentUser._id,
      imagePath: null // No image for direct submissions
    });
  };
  
  // Reset state when navigating to /new
  useEffect(() => {
    // Check if we're at the /new route
    if (location.pathname === "/new") {
      console.log("Resetting state for new chat");
      
      // Only reset if we don't have a pending query from ChatModal
      const isPending = localStorage.getItem('chatModalPending') === 'true';
      if (!isPending) {
        setMessages([]);
        messagesRef.current = [];
        setChatId(null);
        setChatName(null); // Reset chat name
        setShouldNavigate(false);
        pendingQueryProcessed.current = false;
        optimisticMessageSent.current = false; // Reset optimistic message flag
        setSelectedImage(null);
        setImagePreview(null);
      }
    }
  }, [location.pathname]);
  
  useEffect(() => {
    if (paramChatId !== undefined && paramChatId !== null && paramChatId !== "null") { 
      const fetchChat = async () => {
        console.log("Fetching existing chat with ID:", paramChatId);
        try {
          const res = await axios.post(
            `/ai/chat/getChat`, 
            { chatId: paramChatId }, 
            { withCredentials: true }
          );
          console.log("Fetched chat data:", res.data);
          
          // Ensure all message objects have consistent string IDs
          const normalizedMessages = res.data.messages.map(msg => ({
            ...msg,
            id: msg._id || msg.id, // Ensure id exists for all messages
            _id: msg._id || msg.id  // Ensure _id exists for all messages
          }));
          
          setMessages(normalizedMessages);
          messagesRef.current = normalizedMessages; // Store in ref for persistence
          setChatId(paramChatId);
          
          // Set chat name if it exists in the response
          if (res.data.chat && res.data.chat.chatName) {
            setChatName(res.data.chat.chatName);
            console.log("Chat name:", res.data.chat.chatName);
          }
          
          // Clear any pending query data since we're loading an existing chat
          localStorage.removeItem('chatModalQuery');
          localStorage.removeItem('chatModalPending');
          pendingQueryProcessed.current = false;
          optimisticMessageSent.current = false; // Reset optimistic message flag
          setSelectedImage(null);
          setImagePreview(null);
        } catch (error) {
          console.error("Failed to fetch existing chat:", error);
        }
      };
      fetchChat();
    }
  }, [paramChatId]);
  
  // Only handle navigation when shouldNavigate flag is set
  useEffect(() => {
    if (shouldNavigate && chatId && !paramChatId) {
      console.log("Navigating to chatId:", chatId);
      navigate(`/${chatId}`);
      setShouldNavigate(false); // Reset flag after navigation
      
      // Clear pending query data after successful navigation
      localStorage.removeItem('chatModalQuery');
      localStorage.removeItem('chatModalPending');
      pendingQueryProcessed.current = false;
    }
    scrollToBottom();
  }, [shouldNavigate, chatId, navigate, paramChatId]);
  
  console.log('messages', messages);
  console.log('chatName', chatName); // Log the chat name
  
  // Check if a message already exists in the messages array
  const messageExists = (messageToCheck, messagesArray) => {
    return messagesArray.some(existingMsg => {
      // Check message ID match
      const idMatch = (existingMsg._id === messageToCheck._id) || 
                     (existingMsg.id === messageToCheck._id) ||
                     (existingMsg._id === messageToCheck.id) ||
                     (existingMsg.id === messageToCheck.id);
      
      // Check content + timestamp match (alternative for optimistic messages)
      const contentMatch = existingMsg.content === messageToCheck.content && 
                          existingMsg.sender === messageToCheck.sender;
      
      return idMatch || contentMatch;
    });
  };
  
  // Setup socket connection
  useEffect(() => {
    // Clean up any existing socket connection before creating a new one
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
    
    socketRef.current = io(SOCKET_URL, {
      transports: ["websocket"],
      withCredentials: true,
    });
  
    socketRef.current.on("connect", () => {
      console.log("Connected to socket.io server:", socketRef.current.id);
      
      // Process any pending query after socket is connected
      if (location.pathname === "/new" && !pendingQueryProcessed.current) {
        const pendingQuery = localStorage.getItem('chatModalQuery');
        const isPending = localStorage.getItem('chatModalPending') === 'true';
        
        if (pendingQuery && isPending) {
          pendingQueryProcessed.current = true;
          optimisticMessageSent.current = true; // Mark that we've sent an optimistic message
          
          // Submit the query directly
          submitQueryDirectly(pendingQuery);
          
          // Display optimistic user message immediately
          const newUserMessage = {
            id: Date.now().toString(), // Use string ID
            content: pendingQuery,
            role: "user",
            chatId: null,
            timestamp: new Date().toISOString(),
            sender: "user"
          };
          
          setMessages([newUserMessage]);
          messagesRef.current = [newUserMessage];
        }
      }
    });
  
    // Listening for chat started (first message)
    socketRef.current.on("chatStarted", ({ chatId, chatName, messages: newMessages }) => {
      // Set the chatId, chatName, and messages
      console.log("Chat started with ID:", chatId);
      console.log("Chat name:", chatName); // Log the generated chat name
      setChatId(chatId);
      setChatName(chatName); // Store the chat name
      
      // For new chats only, replace all messages with content from server,
      // but avoid duplicate messages
      if (!paramChatId) {
        // Normalize messages to ensure consistent ID format
        const normalizedMessages = newMessages.map(msg => ({
          ...msg,
          id: msg._id || msg.id, // Ensure id exists
          _id: msg._id || msg.id  // Ensure _id exists
        }));
        
        // Deduplicate messages from server against what we might already have
        const uniqueMessages = normalizedMessages.filter(
          serverMsg => !messageExists(serverMsg, messagesRef.current)
        );
        
        // If optimistic message was sent, replace it with server messages
        if (optimisticMessageSent.current) {
          setMessages(normalizedMessages);
          messagesRef.current = normalizedMessages;
          optimisticMessageSent.current = false;
        } else if (uniqueMessages.length > 0) {
          // Only add unique messages
          const updatedMessages = [...messagesRef.current, ...uniqueMessages];
          setMessages(updatedMessages);
          messagesRef.current = updatedMessages;
        }
      }
      
      // Clear image selection after message is sent
      setSelectedImage(null);
      setImagePreview(null);
      
      // Now set the flag to trigger navigation in the dedicated useEffect
      setShouldNavigate(true);
      
      setIsTyping(false);
    });
  
    // Modified messageReceived event handler to handle deduplication
    socketRef.current.on("messageReceived", ({ chatId: receivedChatId, chatName: receivedChatName, messages: receivedMessages }) => {
      // Ensure we have a valid chatId from the response
      if (receivedChatId) {
        setChatId(receivedChatId);
      }
      
      // Update chat name if received
      if (receivedChatName) {
        setChatName(receivedChatName);
        console.log("Updated chat name:", receivedChatName);
      }
      
      // Ensure all received messages have consistent ID format
      const normalizedReceivedMessages = receivedMessages.map(msg => ({
        ...msg,
        id: msg._id || msg.id,
        _id: msg._id || msg.id
      }));
      
      if (receivedChatId && receivedChatId === paramChatId) {
        // For existing chats, we need to deduplicate carefully
        // Find new messages that don't exist in our current state
        const newUniqueMessages = normalizedReceivedMessages.filter(
          serverMsg => !messageExists(serverMsg, messagesRef.current)
        );
        
        // If optimistic message was sent, we need to handle updates carefully
        if (optimisticMessageSent.current) {
          // Find the optimistic message (last user message)
          const optimisticMessageIndex = messagesRef.current.findIndex(
            msg => msg.sender === "user" && !msg._id.includes('/') // Temporary ID doesn't contain '/'
          );
          
          if (optimisticMessageIndex !== -1) {
            // Remove the optimistic message and replace with server messages
            const messagesWithoutOptimistic = [
              ...messagesRef.current.slice(0, optimisticMessageIndex),
              ...messagesRef.current.slice(optimisticMessageIndex + 1)
            ];
            
            // Add new messages from server
            const updatedMessages = [...messagesWithoutOptimistic, ...normalizedReceivedMessages];
            setMessages(updatedMessages);
            messagesRef.current = updatedMessages;
          } else {
            // Just add new unique messages
            if (newUniqueMessages.length > 0) {
              const updatedMessages = [...messagesRef.current, ...newUniqueMessages];
              setMessages(updatedMessages);
              messagesRef.current = updatedMessages;
            }
          }
          
          optimisticMessageSent.current = false;
        } else if (newUniqueMessages.length > 0) {
          // Just add new unique messages
          const updatedMessages = [...messagesRef.current, ...newUniqueMessages];
          setMessages(updatedMessages);
          messagesRef.current = updatedMessages;
        }
      } else if (optimisticMessageSent.current && !paramChatId) {
        // This is a new chat we just created - replace all messages
        setMessages(normalizedReceivedMessages);
        messagesRef.current = normalizedReceivedMessages;
        optimisticMessageSent.current = false; // Reset flag
      } else {
        // New chat or different chat - carefully merge new messages
        const newUniqueMessages = normalizedReceivedMessages.filter(
          serverMsg => !messageExists(serverMsg, messagesRef.current)
        );
        
        if (newUniqueMessages.length > 0) {
          const updatedMessages = [...messagesRef.current, ...newUniqueMessages];
          setMessages(updatedMessages);
          messagesRef.current = updatedMessages;
        }
      }
      
      // Clear image selection after message is sent
      setSelectedImage(null);
      setImagePreview(null);
      
      setIsTyping(false);
    });
  
    socketRef.current.on("error", ({ message }) => {
      console.error(message);
      setIsTyping(false);
    });
  
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [paramChatId, location.pathname]);
  
  // Handle image selection
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };
  
  // Remove selected image
  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() && !selectedImage) return;
  
    setIsTyping(true);
    optimisticMessageSent.current = true; // Set flag for optimistic update
  
    // Create a consistent message structure that matches what the server will return
    const newUserMessage = {
      id: `tmp_${Date.now()}`, // Temporary ID with prefix for easy identification
      _id: `tmp_${Date.now()}`, // Add _id with the same value
      content: inputValue, // Keep content property for optimistic UI update
      text: inputValue,    // Add text property to match server response format
      role: "user",
      chatId: chatId, // Will be null initially for new chats
      timestamp: new Date().toISOString(),
      sender: "user",
      image: imagePreview // Add image preview for immediate display
    };
  
    // Push user message instantly to UI (optimistic update)
    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    messagesRef.current = updatedMessages; // Update ref as well
    
    try {
      let imagePath = null;
      
      // Upload image if selected
      if (selectedImage) {
        const formData = new FormData();
        formData.append('image', selectedImage);
        
        const uploadResponse = await axios.post('/ai/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          withCredentials: true
        });
        
        imagePath = uploadResponse.data.filePath;
      }
      
      // Now send the message to the server
      if (!chatId) {
        // Emit startChat event if chat not started yet
        socketRef.current.emit("startChat", { 
          prompt: inputValue, 
          userId: currentUser._id,
          imagePath
        });
      } else {
        // Otherwise continue the chat
        socketRef.current.emit("sendMessage", { 
          chatId, 
          prompt: inputValue,
          imagePath
        });
      }
    } catch (error) {
      console.error("Error uploading image or sending message:", error);
      setIsTyping(false);
      optimisticMessageSent.current = false; // Reset flag on error
    }
    
    setInputValue("");
  };
  
  const hasMessages = messages.length > 0;
  return (
    <div className="flex flex-col h-screen bg-[#1E1E1E] text-white">
      {!hasMessages ? (
        <div className="flex-1 flex flex-col items-center justify-center">
          <h1 className="text-3xl font-semibold mb-8">What can I help with?</h1>
          <div className="w-full max-w-2xl px-4">
            <InputArea
              inputValue={inputValue}
              setInputValue={setInputValue}
              handleSendMessage={handleSendMessage}
              handleImageSelect={handleImageSelect}
              selectedImage={selectedImage}
              imagePreview={imagePreview}
              handleRemoveImage={handleRemoveImage}
              fileInputRef={fileInputRef}
            />
          </div>
        </div>
      ) : (
        <>
          <main className="flex-1 overflow-y-auto p-4 flex flex-col">
            <div className="space-y-6 pb-4">
              {messages.map((message) => (
                <ChatMessage key={message.id || message._id} message={message} />
              ))}
              {isTyping && (
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1 ml-3">
                    <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </main>
          <div className="p-4">
            <InputArea
              inputValue={inputValue}
              setInputValue={setInputValue}
              handleSendMessage={handleSendMessage}
              handleImageSelect={handleImageSelect}
              selectedImage={selectedImage}
              imagePreview={imagePreview}
              handleRemoveImage={handleRemoveImage}
              fileInputRef={fileInputRef}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default NewChatPage;
