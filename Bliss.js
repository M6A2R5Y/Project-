/**
 * Event listener for the DOMContentLoaded event.
 * Initializes the car list and search functionality.
 */
document.addEventListener('DOMContentLoaded', function()
{
   const loginForm = document.getElementById('loginForm');
   const registerForm = document.getElementById('registerForm');
   
   
   
    const carList = document.getElementById('car-list');
    const searchInput = document.getElementById('search');
     /**
   * Array of car objects.
   */
    const car = [
        {
          image: 'Honda Civic.jpg',
          model:'Honda Civic',
          year:2019,
          price:'Ksh 2,340,000'
        },
        {
            image: 'Chevrolet Camaro.jpg',
            model:'Chevrolet Camaro',
            year:2020,
            price:'Ksh 3,640,000'
        },
        {
            image: 'BMW 3 Series.jpg',
            model:'BMW 3 Series',
            year:2018,
            price:'Ksh 3,250,000'
        },
        {
            image: 'Toyota Corolla.jpg',
            model:'Toyota Corolla',
            year:2020,
            price:'Ksh 2,600,000'
        },
        {
            image: 'Audi A4.jpg',
            model:'Audi A4',
            year:2019,
            price:'Ksh 3,510,000'
        },
        {
            image: 'Mercedes-Benz C-Class.jpg',
            model:'Mercedes-Benz C-Class',
            year:2020,
            price:'Ksh 4,550,000'
        },
        {
            image: 'Hyundai Elantra.jpg',
            model:'Hyundai Elantra',
            year:2021,
            price:'Ksh 2,470,000'
        },
        {
            image: 'Nissan Altima.jpg',
            model:'Nissan Altima',
            year:2020,
            price:'Ksh 2,860,000'
        },
        {
            image: 'Subaru Outback.jpg',
            model:'Subaru Outback',
            year:2019,
            price:'Ksh 3,120,000'
        },
        {
            image: 'Volkswagen Passat.jpg',
            model:'Volkswagen Passat',
            year:2020,
            price:'Ksh 3,380,000'
        },
        {
            image: 'Ford Mustang.jpg',
            model:'Ford Mustang',
            year:2021,
            price:'Ksh 3,900,000'
        },
        {
            image: 'Kia Optima.jpg',
            model:'Kia Optima',
            year:2021,
            price:'Ksh 2,730,000'
        },
        {
            image: 'Honda Accord.jpg',
            model:'Honda Accord',
            year:2018,
            price:'Ksh 2,665,000'
        },
        {
            image: 'Ford Fusion.jpg',
            model:'Ford Fusion',
            year:2019,
            price:'Ksh 2,990,000'
        },
        {
            image: 'Chevrolet Malibu.jpg',
            model:'Chevrolet Malibu',
            year:2020,
            price:'Ksh 2,925,000'
        },
        {
            image: 'Toyota Camry.jpg',
            model:'Toyota Camry',
            year:2021,
            price:'Ksh 3,185,000'
        },
        {
            image: 'Hyundai Sonata.jpg',
            model:'Hyundai Sonata',
            year:2020,
            price:'Ksh 3,055,000'
        },
        {
            image: 'Nissan Maxima.jpg',
            model:'Nissan Maxima',
            year:2019,
            price:'Ksh 3,705,000'
        }
    ];
});

async function searchCar() {
    const searchElement = document.getElementById('search');
    if (!searchElement) return;
    const query = searchElement.value.toLowerCase();
    try {
        const response = await fetch('http://localhost:3000/api/car');
        const car = await response.json();

        const results = car.filter(car => 
            (car.make && car.make.toLowerCase().includes(query)) || 
            (car.model && car.model.toLowerCase().includes(query)) ||
            (car.year && car.year.toString().includes(query)) ||
            (car.price && car.price.toLowerCase().includes(query))
        );

        displayResults(results);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function displayResults(results) {
    const carList = document.querySelector('#search-results .car-list') || document.querySelector('.car-list');
    if (!carList) return;
    carList.innerHTML = ''; // Clear previous results

    if (results.length === 0) {
        carList.innerHTML = '<p>No cars found.</p>';
        return;
    }

    results.forEach(car => {
        const carItem = document.createElement('div');
        carItem.classList.add('car-item');

        carItem.innerHTML = `
            <img src="${car.image}" alt="${car.make || ''} ${car.model || ''}">
            <h3>${car.make || ''} ${car.model || ''}</h3>
            <p>Year: ${car.year || ''}</p>
            <p>Price: ${car.price || ''}</p>
        `;

        carList.appendChild(carItem);
    });
}

// Check and fetch dashboard data only if elements exist
const modelCountEl = document.getElementById('model-count');
const carMakeCountEl = document.getElementById('car-make-count');
if (modelCountEl && carMakeCountEl) {
    fetch('/api/dashboard-data')
      .then(response => response.json())
      .then(data => {
        modelCountEl.textContent = data.model;
        carMakeCountEl.textContent = data.carmake;
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
}

// Function to fetch data from the API
async function fetchData(endpoint) {
    const response = await fetch(endpoint);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
}

async function fetchAndDisplayData() {
    try {
      const ordersData = await fetchData('/api/order');
      const inventoryData = await fetchData('/api/financing');
      const customersData = await fetchData('/api/customer');
  
      // Populate HTML elements with data
      populateorderTable(ordersData);
      populatefinancingTable(inventoryData);
      populatecustomerTable(customersData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
}

// Only run fetchAndDisplayData if tables exist or we are on the dashboard
const ordersEl = document.getElementById('orders');
const inventoryEl = document.getElementById('inventory');
const customersEl = document.getElementById('customers');
if (ordersEl && inventoryEl && customersEl) {
    fetchAndDisplayData();
}

// Functions to populate tables
function populateorderTable(data) {
    const ordersEl = document.getElementById('orders');
    if (ordersEl) {
        // Create table structure and populate with data
    }
}

function populatefinancingTable(data) {
    const inventoryEl = document.getElementById('inventory');
    if (inventoryEl) {
        // Create table structure and populate with data
    }
}

function populatecustomerTable(data) {
    const customersEl = document.getElementById('customers');
    if (customersEl) {
        // Create table structure and populate with data
    }
}

// Submit Contact Form
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            fetch('http://localhost:3000/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, message })
            })
            .then(response => {
                if (response.ok) {
                    alert('Thank you for contacting us! Your inquiry has been saved.');
                    contactForm.reset();
                } else {
                    alert('Failed to submit message.');
                }
            })
            .catch(err => {
                console.error('Error:', err);
                alert('An error occurred. Please try again later.');
            });
        });
    }

    // Chatbot logic
    const chatbotButton = document.getElementById('chatbot-button');
    const chatbotWindow = document.getElementById('chatbot-window');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatInput = document.getElementById('chat-input');
    const sendChatBtn = document.getElementById('send-chat');
    const chatMessages = document.getElementById('chat-messages');
    const leadForm = document.getElementById('chat-leads-form');
    const leadSubmit = document.getElementById('submit-lead');

    let customerName = localStorage.getItem('chat_customer_name') || '';
    let customerEmail = localStorage.getItem('chat_customer_email') || '';
    let chatHistory = [];

    if (chatbotButton && chatbotWindow && chatbotClose) {
        chatbotButton.addEventListener('click', () => {
            chatbotWindow.classList.toggle('active');
            if (chatbotWindow.classList.contains('active')) {
                checkLeadStatus();
            }
        });

        chatbotClose.addEventListener('click', () => {
            chatbotWindow.classList.remove('active');
        });
    }

    function checkLeadStatus() {
        if (!customerName || !customerEmail) {
            leadForm.style.display = 'flex';
            chatInput.disabled = true;
            sendChatBtn.disabled = true;
        } else {
            leadForm.style.display = 'none';
            chatInput.disabled = false;
            sendChatBtn.disabled = false;
            if (chatMessages.children.length === 0) {
                appendMessage('AI', `Hello ${customerName}! Welcome to Bliss Autos. How can I help you today?`);
            }
        }
    }

    if (leadSubmit) {
        leadSubmit.addEventListener('click', () => {
            const nameInput = document.getElementById('lead-name');
            const emailInput = document.getElementById('lead-email');
            if (nameInput.value.trim() && emailInput.value.trim()) {
                customerName = nameInput.value.trim();
                customerEmail = emailInput.value.trim();
                localStorage.setItem('chat_customer_name', customerName);
                localStorage.setItem('chat_customer_email', customerEmail);
                checkLeadStatus();
            } else {
                alert('Please provide your name and email to start chatting.');
            }
        });
    }

    function appendMessage(sender, text) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('chat-message');
        messageDiv.classList.add(sender === 'Customer' ? 'customer' : 'ai');
        messageDiv.textContent = text;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    async function sendMessage() {
        const text = chatInput.value.trim();
        if (!text) return;

        appendMessage('Customer', text);
        chatInput.value = '';

        const tempAiMessage = document.createElement('div');
        tempAiMessage.classList.add('chat-message', 'ai');
        tempAiMessage.textContent = 'Typing...';
        chatMessages.appendChild(tempAiMessage);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        try {
            const response = await fetch('http://localhost:3000/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: customerName,
                    email: customerEmail,
                    message: text,
                    history: chatHistory
                })
            });
            const data = await response.json();
            
            chatMessages.removeChild(tempAiMessage);

            appendMessage('AI', data.response);
            chatHistory.push({ sender: 'Customer', text: text });
            chatHistory.push({ sender: 'AI', text: data.response });
        } catch (error) {
            console.error('Error sending chat:', error);
            if (chatMessages.contains(tempAiMessage)) {
                chatMessages.removeChild(tempAiMessage);
            }
            appendMessage('AI', 'Sorry, I am having trouble connecting right now. Please try again.');
        }
    }

    if (sendChatBtn) {
        sendChatBtn.addEventListener('click', sendMessage);
    }
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    }
});
  

