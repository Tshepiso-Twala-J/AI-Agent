import {apiKey} from "./config.js";

const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

Window.onload = () => {
    const savedChat = localStorage.getItem("chatHistory");
    console.log("Saved chat history");
    if(savedChat){
        chatBox.innerHTML = savedChat;
        chatBox.scrollTop = chatBox.scrollHeight;
    }
}

// Function to add a message to the chat box
function addMessage(message, className){
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", className);
    messageDiv.textContent = message;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}
//Function to show "AI is typing..." message
function showTyping(){
    const typingDiv = document.createElement("div");
    typingDiv.classList.add("message", "ai-message");
    typingDiv.textContent = "AI is typing . . .";
    chatBox.appendChild(typingDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
    return typingDiv;
}

async function getAiReply(userMessage){
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}';
    
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                contents: [{parts: [{text: userMessage}]}] //https://ai.google.dev/api
            })
        });
        const data = await response.json();
        

        if(!response.ok){
            console.error("API Error:", data);
            return data?.error?.message ||  "An error occurred while trying to respond to your question.";
        }

        return(data.candidates[0]?.content?.parts[0]?.text || "Sorry, I couldn't get that.");
    } catch (error) {
        
    }
}


sendBtn.onclick = async() => {
    const message = userInput.value.trim();
    if (message === "") return;
    addMessage(message, "user-message");
    userInput.value = "";

    //show reply
    const typingDiv = showTyping();

    //get reply from AI
    const aiReply = await getAiReply();
    typingDiv.remove();
    addMessage(aiReply, "ai-message");

    //save message to local storage
    localStorage.setItem("chatHistory", chatBox.innerHTML);

}

//for when hitting enter for message to go
userInput.addEventListener("keypress", (e) =>{
    if(e.key === "Enter") sendBtn.click();
});