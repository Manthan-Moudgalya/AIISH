import React, { useState, useEffect, useRef } from 'react';
import './chatBot.css';

function chatBot() {
  const [showChatbot, setShowChatbot] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isFirstOpen, setIsFirstOpen] = useState(true);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [idleMessageSent, setIdleMessageSent] = useState(false);
  const [sessionId] = useState(generateSessionId());
  const [inputValue, setInputValue] = useState('');
  const [typing, setTyping] = useState(false);

  const chatbotMessagesRef = useRef(null);
  const idleTimeoutRef = useRef(null);
  const typingIndicatorRef = useRef(null);

  // For demonstration purposes, we'll define a mock navigation function
  // In a real app, this would use React Router's useNavigate
  const navigate = (path) => {
    console.log(`Navigating to: ${path}`);
    // In a real app with React Router:
    // navigate(path);
    
    // For demo purposes:
    window.location.href = path;
  };

  useEffect(() => {
    if (showChatbot && isFirstOpen) {
      displayWelcomeMessage();
      // Only load chat history if backend is available
      // loadChatHistory();
      setIsFirstOpen(false);
    }
    // eslint-disable-next-line
  }, [showChatbot]);

  useEffect(() => {
    resetIdleTimer();
    // eslint-disable-next-line
  }, [conversationHistory, showChatbot]);

  function generateSessionId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = (Math.random() * 16) | 0, v = c === 'x' ? r : ((r & 0x3) | 0x8);
      return v.toString(16);
    });
  }

  // Mock API functions to handle the missing backend
  async function saveChatMessage(role, text) {
    try {
      // Store in localStorage instead of calling API
      const storageKey = `chatHistory_${sessionId}`;
      const existingHistory = JSON.parse(localStorage.getItem(storageKey) || '[]');
      existingHistory.push({
        sessionId,
        role,
        text,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem(storageKey, JSON.stringify(existingHistory));
    } catch (error) {
      console.error('Error saving chat message:', error);
    }
  }

  async function loadChatHistory() {
    try {
      // Load from localStorage
      const storageKey = `chatHistory_${sessionId}`;
      const messages = JSON.parse(localStorage.getItem(storageKey) || '[]');
      
      if (Array.isArray(messages) && messages.length > 0) {
        const newHistory = [];
        messages.forEach((msg) => {
          appendMessage(msg.role, msg.text, false, new Date(msg.timestamp));
          newHistory.push({ role: msg.role, text: msg.text });
        });
        setConversationHistory(newHistory);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  }

  async function clearChatHistory() {
    try {
      // Clear from localStorage
      localStorage.removeItem(`chatHistory_${sessionId}`);
    } catch (error) {
      console.error('Error clearing chat history:', error);
    }
  }

  function resetIdleTimer() {
    clearTimeout(idleTimeoutRef.current);
    setIdleMessageSent(false); // Reset idle message flag
    idleTimeoutRef.current = setTimeout(() => {
      // Only send idle message if the last message was from the user
      if (conversationHistory.length > 0 && 
          conversationHistory[conversationHistory.length - 1].role === "user" && 
          !idleMessageSent) {
        const idleMessage = "If you don't have any further questions, please click 'End Chat' to close this session.";
        appendMessage("bot", idleMessage);
        setConversationHistory(prev => [...prev, { role: "bot", text: idleMessage }]);
        saveChatMessage("bot", idleMessage);
        setIdleMessageSent(true); // Prevent sending the idle message again
      }
    }, 5 * 60 * 1000); // 5 minutes
  }

  function confirmEndChat() {
    // setShowConfirm(true);
    setShowConfirm(false);
    setShowChatbot(false);
    setConversationHistory([]);
    setIdleMessageSent(false);
    if (chatbotMessagesRef.current) chatbotMessagesRef.current.innerHTML = "";
    clearChatHistory();
    return;
  }

  function displayWelcomeMessage() {
    const welcomeMessage = "Hi, I'm AIISH CARE. How can I help you today?";
    const replies = [
      // Direct link for appointment booking
      { text: "Book Appointment", message: "I want to book an appointment", directLink: "/patientDashboard" },
      { text: "Clinic Hours", message: "What are the clinic operating hours?" },
      { text: "Therapy Services", message: "What services are offered?" },
      { text: "Teletherapy", message: "Tell me about teletherapy." },
      { text: "Aphasia Info", message: "What is aphasia?" },
      { text: "Child Therapy", message: "What therapy options are available for children?" }
    ];
    setIsFirstOpen(true);
    setIdleMessageSent(false);
    clearTimeout(idleTimeoutRef.current);
    clearChatHistory();

    // Show welcome message
    appendMessage("bot", welcomeMessage, true);
    setConversationHistory([{ role: "bot", text: welcomeMessage }]);

    // Show quick replies
    const replyContainer = document.createElement("div");
    replyContainer.classList.add("quick-replies");
    replies.forEach((reply) => {
      const button = document.createElement("button");
      button.textContent = reply.text;
      button.classList.add("quick-reply-btn");
      
      // Handle direct links (like Book Appointment)
      if (reply.directLink) {
        button.addEventListener("click", () => {
          // Add to chat history that user clicked this button
          appendMessage("user", reply.message);
          setConversationHistory(prev => [...prev, { role: "user", text: reply.message }]);
          saveChatMessage("user", reply.message);
          
          // Add bot response that we're redirecting
          const redirectMessage = `Directing you to our appointment booking page...`;
          appendMessage("bot", redirectMessage);
          setConversationHistory(prev => [...prev, { role: "bot", text: redirectMessage }]);
          saveChatMessage("bot", redirectMessage);
          
          // Navigate to the appointment page after a brief delay
          setTimeout(() => {
            navigate(reply.directLink);
          }, 500);
          
          // Remove quick reply buttons
          replyContainer.remove();
        });
      } else {
        // Normal quick reply functionality for other buttons
        button.addEventListener("click", () => {
          appendMessage("user", reply.message);
          setConversationHistory(prev => [...prev, { role: "user", text: reply.message }]);
          saveChatMessage("user", reply.message);
          getBotResponse(reply.message);
          replyContainer.remove();
          resetIdleTimer();
        });
      }
      
      replyContainer.appendChild(button);
    });
    
    if (chatbotMessagesRef.current) {
      chatbotMessagesRef.current.appendChild(replyContainer);
      chatbotMessagesRef.current.scrollTop = chatbotMessagesRef.current.scrollHeight;
    }
  }

  function handleCancelEndChat() {
    setShowConfirm(false);
  }

  function handleConfirmEndChat() {
    setShowConfirm(false);
    setShowChatbot(false);
    setConversationHistory([]);
    setIdleMessageSent(false);
    if (chatbotMessagesRef.current) chatbotMessagesRef.current.innerHTML = "";
    clearChatHistory();
  }

  function sendMessage() {
    const userMessage = inputValue.trim();
    if (userMessage) {
      appendMessage("user", userMessage);
      setConversationHistory(prev => [...prev, { role: "user", text: userMessage }]);
      saveChatMessage("user", userMessage);
      setInputValue("");
      getBotResponse(userMessage);
      resetIdleTimer();
    }
  }

  function appendMessage(sender, message, isWelcome = false, timestamp = new Date()) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message", sender);
    if (isWelcome) messageElement.classList.add("welcome-message");

    const textElement = document.createElement("div");
    textElement.classList.add("message-text");
    
    // Use innerHTML instead of textContent to support links
    textElement.innerHTML = message;
    
    // Add click event handler for any links
    const links = textElement.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const href = link.getAttribute('href');
        if (href) {
          // Use our navigate function
          navigate(href);
        }
      });
    });

    const timeElement = document.createElement("div");
    timeElement.classList.add("message-time");
    timeElement.textContent = timestamp.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    messageElement.appendChild(textElement);
    messageElement.appendChild(timeElement);
    if (chatbotMessagesRef.current) {
      chatbotMessagesRef.current.appendChild(messageElement);
      chatbotMessagesRef.current.scrollTop = chatbotMessagesRef.current.scrollHeight;
    }
  }

  async function getBotResponse(userMessage) {
    setTyping(true);
    if (typingIndicatorRef.current) {
      typingIndicatorRef.current.classList.remove("hidden");
    }
    
    // API key and URL - Replace with your actual API key
    const API_KEY = "YOUR_GEMINI_API_KEY"; // Replace this with your actual API key
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

    const sanitizedMessage = userMessage.replace(/[<>]/g, "");
    
    // Get recent conversation history (limited to 6 messages)
    const recentHistory = [...conversationHistory].slice(-6);
    const conversationContext = recentHistory
      .map((msg) => `${msg.role === "user" ? "Patient" : "Assistant"}: ${msg.text}`)
      .join("\n");

    const fullPrompt = `
You are AIISH CARE, a virtual health assistant at AIISH, Mysuru. Respond in one short, professional sentence. Stay on-topic and context-aware.

Below are example responses for common queries:

- Query: "greetings" or "hi" or "hello"
  Response: Hello, it's nice to assist you today. How can I help with your speech therapy needs?
- Query: "how can i book an appointment" or "appointments"
  Response: You can book an appointment through our online portal, which is quick and easy. Would you like the link to the portal or a guide to get started?
- Query: "what kind of exercises help with stuttering"
  Response: Stuttering therapy includes breathing exercises and fluency-shaping techniques tailored by our clinicians. Would you like to learn about our personalized therapy tools?
- Query: "what are the clinic operating hours"
  Response: Our clinic is open Monday to Friday, 9 AM to 5 PM. Would you like to schedule an appointment during those hours?
- Query: "can i record my therapy session"
  Response: Yes, with your clinician's consent, you can record sessions for review, stored securely for 12 months. Would you like to know more about session features like shared notes?
- Query: "what services are offered" or "speech therapy services"
  Response: We provide speech therapy, audiology, and rehabilitation engineering for various needs. Are you looking for a specific service?
- Query: "teletherapy" or "online therapy"
  Response: Our teletherapy sessions are conducted securely online, offering flexibility. Would you like to book a teletherapy session or learn more?
- Query: "cost of therapy" or "fees"
  Response: Therapy costs depend on the session type, and we can provide a detailed estimate during consultation. Would you like to schedule a consultation to discuss pricing?
- Query: "accessibility features" or "support for disabilities"
  Response: Our platform supports screen readers and adjustable text for accessibility. Would you like details on how we can accommodate specific needs?
- Query: "cancel appointment" or "reschedule appointment"
  Response: You can cancel or reschedule appointments easily through our online portal. Would you like the link to manage your appointment?
- Query: "speech therapy for children" or "pediatric therapy"
  Response: We offer child-friendly speech therapy tailored to young patients' needs. Would you like to arrange a consultation for a child?
- Query: "how to prepare for a session" or "session preparation"
  Response: Prepare a quiet space and any materials recommended by your clinician for a productive session. Would you like tips for a specific therapy type?
- Query: "contact information" or "how to reach the clinic"
  Response: You can contact us at +91-821-2502100 or through our website's contact form. Would you prefer the website link or more details?
- Query: "what is aphasia" or "aphasia information"
  Response: Aphasia is a condition affecting language comprehension and expression, often caused by brain injury. Would you like to explore therapy options for aphasia?
- Query: "dysarthria" or "what is dysarthria"
  Response: Dysarthria involves difficulty with speech due to muscle weakness, and our therapists can help improve clarity. Would you like to discuss treatment plans for dysarthria?
- Query: "track therapy progress" or "how to monitor progress"
  Response: Your clinician will provide progress reports, and our platform tracks session outcomes. Would you like to schedule a review with your therapist?
- Query: "post-session exercises" or "exercises after therapy"
  Response: Your clinician will assign specific exercises to practice at home, accessible via our portal. Would you like guidance on accessing these materials?
- Query: "insurance" or "does insurance cover therapy"
  Response: Insurance coverage varies, and our office can verify your plan's benefits. Would you like us to assist with an insurance inquiry?
- Query: "emergency contact" or "urgent help"
  Response: For urgent issues, please call our clinic at +91-821-2502100 or visit the nearest hospital. Can I help with non-urgent questions now?
- Query: "clinician qualifications" or "therapist credentials"
  Response: Our clinicians are certified speech-language pathologists with extensive training. Would you like to know more about our team or book with a specific therapist?
- Default (unrecognized queries)
  Response: I'm not sure I fully understand your question, but I'm here to help. Could you provide more details, or would you like to schedule a consultation?

End responses with a helpful follow-up question if possible.

Conversation history:
${conversationContext}

Current patient query: ${sanitizedMessage}
`;

    try {
      // Check if the API key is set to the placeholder
      if (API_KEY === "YOUR_GEMINI_API_KEY") {
        // If using the placeholder, provide a mock response
        setTimeout(() => {
          if (typingIndicatorRef.current) {
            typingIndicatorRef.current.classList.add("hidden");
          }
          setTyping(false);
          
          // Generate a response based on the user's message
          let botMessage = getMockResponse(userMessage);
          
          appendMessage("bot", botMessage);
          setConversationHistory(prev => [...prev, { role: "bot", text: botMessage }]);
          saveChatMessage("bot", botMessage);
        }, 1000); // Simulate API delay
      } else {
        // If using a real API key, make the actual API call
        const response = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: fullPrompt }] }],
          }),
        });

        if (typingIndicatorRef.current) {
          typingIndicatorRef.current.classList.add("hidden");
        }
        setTyping(false);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (!data.candidates || !data.candidates.length) {
          throw new Error("No response from Gemini API");
        }

        let botMessage = data.candidates[0].content.parts[0].text.trim();

        if (botMessage.length < 10 || botMessage.includes("I don't understand")) {
          botMessage = "I'm not sure I understood that. Can you rephrase or give more details?";
        }

        appendMessage("bot", botMessage);
        setConversationHistory(prev => [...prev, { role: "bot", text: botMessage }]);
        saveChatMessage("bot", botMessage);
      }
    } catch (error) {
      console.error("API error:", error);
      if (typingIndicatorRef.current) {
        typingIndicatorRef.current.classList.add("hidden");
      }
      setTyping(false);
      const errorMessage = "I'm having trouble responding now. Try again later or contact the clinic.";
      appendMessage("bot", errorMessage);
      setConversationHistory(prev => [...prev, { role: "bot", text: errorMessage }]);
      saveChatMessage("bot", errorMessage);
    }
  }

  // Function to generate mock responses when no API key is provided
  function getMockResponse(userMessage) {
    const userMsgLower = userMessage.toLowerCase();
    
    // Simple pattern matching for mock responses
    if (userMsgLower.includes("appointment") || userMsgLower.includes("book")) {
      if (userMsgLower.includes("yes") || userMsgLower.includes("link") || userMsgLower.includes("portal")) {
        return "Here's the link to our appointment portal: <a href='/PatientDashboard' class='portal-link'>Book Appointment</a>. Would you like any assistance navigating the portal?";
      }
      return "You can book an appointment through our online portal, which is quick and easy. Would you like the link to the portal or a guide to get started?";
    }
    else if (userMsgLower.includes("hour") || userMsgLower.includes("open")) {
      return "Our clinic is open Monday to Friday, 9 AM to 5 PM. Would you like to schedule an appointment during those hours?";
    }
    else if (userMsgLower.includes("services") || userMsgLower.includes("therapy")) {
      return "We provide speech therapy, audiology, and rehabilitation engineering for various needs. Are you looking for a specific service?";
    }
    else if (userMsgLower.includes("teletherapy") || userMsgLower.includes("online")) {
      return "Our teletherapy sessions are conducted securely online, offering flexibility. Would you like to book a teletherapy session or learn more?";
    }
    else if (userMsgLower.includes("aphasia")) {
      return "Aphasia is a condition affecting language comprehension and expression, often caused by brain injury. Would you like to explore therapy options for aphasia?";
    }
    else if (userMsgLower.includes("child") || userMsgLower.includes("children")) {
      return "We offer child-friendly speech therapy tailored to young patients' needs. Would you like to arrange a consultation for a child?";
    }
    else if (userMsgLower.includes("hi") || userMsgLower.includes("hello") || userMsgLower.includes("hey")) {
      return "Hello, it's nice to assist you today. How can I help with your speech therapy needs?";
    }
    else if (userMsgLower.includes("cost") || userMsgLower.includes("price") || userMsgLower.includes("fee")) {
      return "Therapy costs depend on the session type, and we can provide a detailed estimate during consultation. Would you like to schedule a consultation to discuss pricing?";
    }
    else if (userMsgLower.includes("contact") || userMsgLower.includes("phone") || userMsgLower.includes("email")) {
      return "You can contact us at +91-821-2502100 or through our website's contact form. Would you prefer the website link or more details?";
    }
    else {
      return "I'm not sure I fully understand your question, but I'm here to help. Could you provide more details, or would you like to schedule a consultation?";
    }
  }

  return (
    <>
      <div
        id="chatbot-icon"
        aria-label="Open AIISH CARE ChatBot"
        style={{ display: showChatbot ? "none" : "flex", cursor: "pointer" }}
        onClick={() => setShowChatbot(true)}
      >
        💬
      </div>
      {showChatbot && (
        <div id="chatbot-container">
          <div id="chatbot-header">
            <span>AIISH CARE</span>
            <div>
              <button id="end-chat-btn" onClick={confirmEndChat}>End Chat</button>
              <button id="clear-btn" onClick={() => {
                if (chatbotMessagesRef.current) chatbotMessagesRef.current.innerHTML = "";
                setConversationHistory([]);
                setIdleMessageSent(false);
                displayWelcomeMessage();
                clearChatHistory();
              }}>
                Clear
              </button>
            </div>
          </div>
          <div id="chatbot-body">
            <div id="chatbot-messages" ref={chatbotMessagesRef}></div>
            <div id="typing-indicator" ref={typingIndicatorRef} className={typing ? "" : "hidden"}>
              <span className="spinner"></span> Bot is typing...
            </div>
          </div>
          <div id="chatbot-input-container">
            <input
              type="text"
              id="chatbot-input"
              placeholder="Type a message..."
              aria-label="Type your message"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyPress={e => { if (e.key === "Enter") sendMessage(); }}
            />
            <button id="send-btn" aria-label="Send Message" onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
      {showConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <p>Are you sure you want to end the chat? Your conversation will be cleared.</p>
            <button onClick={handleConfirmEndChat}>Yes, End Chat</button>
            <button onClick={handleCancelEndChat}>Cancel</button>
          </div>
        </div>
      )}
    </>
  );
}

export default chatBot;