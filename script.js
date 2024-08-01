const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatBox = document.querySelector(".chatbox");
const resetBtn = document.querySelector(".reset");
const apiKey = "AIzaSyATKp3NHwEThKz4hFCqiBEsSgKCVqGYctU";
let userMessage;

const scrollToBottom = () => {
  chatBox.scrollTop = chatBox.scrollHeight;
};

const resetChat = () => {
  chatBox.innerHTML = "";
  chatBox.appendChild(createChatLi("Hi, how can I help you?", "incoming"));
};
resetBtn.addEventListener("click", resetChat);
const createChatLi = (message, className) => {
  const chatLi = document.createElement("li");
  chatLi.classList.add("chat", className);
  let chatContent =
    className === "outgoing"
      ? `<p></p><span class="material-symbols-outlined">account_circle</span>`
      : `<span class="material-symbols-outlined">smart_toy</span> <p></p>`;
  chatLi.innerHTML = chatContent;
  chatLi.querySelector("p").textContent = message;
  return chatLi;
};

const generateResponse = (incomingChatLi) => {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;
  const messageElement = incomingChatLi.querySelector("p");
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: userMessage }],
        },
      ],
    }),
  };

  fetch(url, requestOptions)
    .then((res) => res.json())
    .then((data) => {
      messageElement.textContent = data.candidates[0].content.parts[0].text;
    })
    .catch((error) => {
      messageElement.textContent = "Something went wrong. Please try again after some time.";
    })
    .finally(() => {
      scrollToBottom();
    });
};

const handleChat = () => {
  userMessage = chatInput.value.trim();
  if (!userMessage) return;
  chatInput.value = "";
  chatBox.appendChild(createChatLi(userMessage, "outgoing"));

  const incomingChatLi = createChatLi("Typing...", "incoming");
  chatBox.appendChild(incomingChatLi);
  generateResponse(incomingChatLi);
  scrollToBottom();
};

sendChatBtn.addEventListener("input", handleChat);
chatInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    handleChat();
  }
});
