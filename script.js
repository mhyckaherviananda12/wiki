const chatBox = document.getElementById('chatBox');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');
const MAX_MESSAGES = 50; // Batasi jumlah pesan yang ditampilkan

// Wikipedia API Function (Bahasa Indonesia)
async function fetchWikipedia(query) {
    const url = `https://id.wikipedia.org/w/api.php?action=query&list=search&srsearch=${query}&format=json&origin=*`;
    const response = await fetch(url);
    const data = await response.json();
    return data.query.search;
}

// Append message to chat
function appendMessage(content, sender) {
    const message = document.createElement('div');
    message.className = `message ${sender}`;
    message.innerHTML = content; // Allow HTML formatting for structured answers
    chatBox.appendChild(message);

    // Batasi jumlah pesan yang ditampilkan
    if (chatBox.children.length > MAX_MESSAGES) {
        chatBox.removeChild(chatBox.firstElementChild); // Hapus pesan pertama jika lebih dari MAX_MESSAGES
    }

    // Scroll ke bawah otomatis setelah pesan baru ditambahkan
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Format results into a structured explanation
function formatResults(results) {
    let formatted = `<strong>Menurut Wikipedia, ini yang berhasil MhyAI temukan:</strong><br><br>`;
    results.forEach((result, index) => {
        formatted += `<strong>${index + 1}. ${result.title}</strong><br>`;
        formatted += `${result.snippet.replace(/(<([^>]+)>)/gi, '')}<br>`;
        formatted += `<a href="https://id.wikipedia.org/wiki/${encodeURIComponent(result.title)}" target="_blank">Baca selengkapnya</a><br><br>`;
    });
    formatted += `<em>Semoga informasi ini bermanfaat buat kamu ya!</em>`;
    return formatted;
}

// Handle user input and fetch results
async function handleUserInput() {
    let query = userInput.value.trim();
    if (!query) return;

    appendMessage(userInput.value, 'user'); // Display user's input
    userInput.value = '';

    appendMessage('Sebentar ya MhyAI, aku sedang mencari informasi...', 'bot');
    try {
        const results = await fetchWikipedia(query);
        if (results.length > 0) {
            appendMessage(formatResults(results), 'bot');
        } else {
            appendMessage('Hmm, MhyAI nggak nemu informasi yang sesuai. Coba tanyakan dengan kata kunci lain.', 'bot');
        }
    } catch (error) {
        appendMessage('Aduh, sepertinya ada masalah saat aku mencari informasi. Coba lagi nanti, ya!', 'bot');
    }
}

// Event Listeners
sendButton.addEventListener('click', handleUserInput);
userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        handleUserInput();
    }
});
