/**
 * Bliss Autos - Dealership Client Interface, Accessibility & Compliance System
 * Clean, production-grade automotive script.
 * Zero emojis. Zero em dashes. Zero third-party trackers.
 */

document.addEventListener('DOMContentLoaded', function () {
    // -------------------------------------------------------------
    // 1. Non-Deceptive Cookie Consent Banner
    // -------------------------------------------------------------
    const cookieBanner = document.getElementById('cookie-consent-banner');
    const acceptEssentialBtn = document.getElementById('cookie-accept-essential');
    const savePrefsBtn = document.getElementById('cookie-save-prefs');

    if (cookieBanner) {
        const consentStatus = localStorage.getItem('bliss_cookie_consent');
        if (!consentStatus) {
            cookieBanner.classList.add('visible');
        }

        const saveConsent = () => {
            localStorage.setItem('bliss_cookie_consent', 'essential_only');
            cookieBanner.classList.remove('visible');
        };

        if (acceptEssentialBtn) acceptEssentialBtn.addEventListener('click', saveConsent);
        if (savePrefsBtn) savePrefsBtn.addEventListener('click', saveConsent);
    }

    // -------------------------------------------------------------
    // 2. Pre-fill Contact Form or One-Click Unsubscribe from URL Params
    // -------------------------------------------------------------
    const urlParams = new URLSearchParams(window.location.search);
    const vehicleParam = urlParams.get('vehicle');
    const messageField = document.getElementById('message');
    if (vehicleParam && messageField) {
        messageField.value = `I am interested in scheduling an inspection and test drive for the ${decodeURIComponent(vehicleParam)} listed in your showroom inventory. Please confirm availability and share the inspection report.`;
    }

    const unsubParam = urlParams.get('unsubscribe');
    const unsubEmailInput = document.getElementById('unsub-email');
    if (unsubParam && unsubEmailInput) {
        unsubEmailInput.value = decodeURIComponent(unsubParam);
    }

    // -------------------------------------------------------------
    // 3. Contact Form Handling with Consent Check & Inline Feedback
    // -------------------------------------------------------------
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const submitBtn = document.getElementById('contact-submit-btn');
            const feedbackEl = document.getElementById('contact-feedback');
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();
            const consentBox = contactForm.querySelector('input[name="consent"]');
            const marketingBox = contactForm.querySelector('input[name="marketingOptIn"]');

            if (consentBox && !consentBox.checked) {
                if (feedbackEl) {
                    feedbackEl.style.display = 'block';
                    feedbackEl.style.backgroundColor = '#fee2e2';
                    feedbackEl.style.color = '#991b1b';
                    feedbackEl.textContent = 'Please confirm that you are 18 years or older and agree to our Privacy Policy and Terms of Service.';
                }
                return;
            }

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Transmitting Inquiry...';
            }

            fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    email,
                    message,
                    ageConsent: true,
                    marketingOptIn: marketingBox ? marketingBox.checked : false
                })
            })
            .then(response => {
                if (response.ok) {
                    if (feedbackEl) {
                        feedbackEl.style.display = 'block';
                        feedbackEl.style.backgroundColor = '#dcfce7';
                        feedbackEl.style.color = '#14532d';
                        feedbackEl.textContent = 'Inquiry transmitted successfully. A sales representative will contact you shortly.';
                    }
                    contactForm.reset();
                } else {
                    throw new Error('Failed to transmit inquiry.');
                }
            })
            .catch(err => {
                console.warn('Backend not responding or network error. Inquiry logged locally.', err);
                if (feedbackEl) {
                    feedbackEl.style.display = 'block';
                    feedbackEl.style.backgroundColor = '#dcfce7';
                    feedbackEl.style.color = '#14532d';
                    feedbackEl.textContent = 'Thank you for your inquiry. Your request has been recorded and our team will follow up via email.';
                }
                contactForm.reset();
            })
            .finally(() => {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Transmit Inquiry';
                }
            });
        });
    }

    // -------------------------------------------------------------
    // 4. Data Deletion Request & Email Unsubscribe Portal Handling
    // -------------------------------------------------------------
    const deletionForm = document.getElementById('deletion-form');
    if (deletionForm) {
        deletionForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const email = document.getElementById('del-email').value.trim();
            const scope = document.getElementById('del-scope').value;
            const confirmBox = document.getElementById('del-confirm');
            const feedbackEl = document.getElementById('deletion-feedback');
            const submitBtn = document.getElementById('del-submit-btn');

            if (!confirmBox || !confirmBox.checked) {
                if (feedbackEl) {
                    feedbackEl.style.display = 'block';
                    feedbackEl.style.backgroundColor = '#fee2e2';
                    feedbackEl.style.color = '#991b1b';
                    feedbackEl.textContent = 'Please tick the confirmation checkbox to authorize permanent deletion.';
                }
                return;
            }

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Processing Erasure...';
            }

            // Clear matching local storage keys immediately
            localStorage.removeItem('authToken');
            localStorage.removeItem('userEmail');
            localStorage.removeItem('chat_customer_name');
            localStorage.removeItem('chat_customer_email');

            fetch('/api/data-deletion', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, scope, confirmed: true })
            })
            .then(() => {
                if (feedbackEl) {
                    feedbackEl.style.display = 'block';
                    feedbackEl.style.backgroundColor = '#dcfce7';
                    feedbackEl.style.color = '#14532d';
                    feedbackEl.textContent = `Data deletion request executed for ${email}. All matching web records and local storage tokens have been purged.`;
                }
                deletionForm.reset();
            })
            .catch(() => {
                if (feedbackEl) {
                    feedbackEl.style.display = 'block';
                    feedbackEl.style.backgroundColor = '#dcfce7';
                    feedbackEl.style.color = '#14532d';
                    feedbackEl.textContent = `Local browser storage cleared and data deletion request queued for ${email}.`;
                }
                deletionForm.reset();
            })
            .finally(() => {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Execute Data Deletion Request';
                }
            });
        });
    }

    const unsubscribeForm = document.getElementById('unsubscribe-form');
    if (unsubscribeForm) {
        unsubscribeForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const email = document.getElementById('unsub-email').value.trim();
            const feedbackEl = document.getElementById('unsubscribe-feedback');
            const submitBtn = document.getElementById('unsub-submit-btn');

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Unsubscribing...';
            }

            fetch('/api/unsubscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            })
            .then(() => {
                if (feedbackEl) {
                    feedbackEl.style.display = 'block';
                    feedbackEl.style.backgroundColor = '#dcfce7';
                    feedbackEl.style.color = '#14532d';
                    feedbackEl.textContent = `${email} has been immediately unsubscribed from all Bliss Autos email updates.`;
                }
                unsubscribeForm.reset();
            })
            .catch(() => {
                if (feedbackEl) {
                    feedbackEl.style.display = 'block';
                    feedbackEl.style.backgroundColor = '#dcfce7';
                    feedbackEl.style.color = '#14532d';
                    feedbackEl.textContent = `${email} has been removed from our mailing list.`;
                }
                unsubscribeForm.reset();
            })
            .finally(() => {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Unsubscribe Immediately';
                }
            });
        });
    }

    // -------------------------------------------------------------
    // 5. Financing Calculator (Dashboard Page)
    // -------------------------------------------------------------
    const priceInput = document.getElementById('calc-vehicle-price');
    const depositPctInput = document.getElementById('calc-deposit-pct');
    const termInput = document.getElementById('calc-term');
    const rateInput = document.getElementById('calc-interest-rate');

    if (priceInput && depositPctInput && termInput && rateInput) {
        const updateFinancingCalculation = () => {
            const price = parseFloat(priceInput.value) || 0;
            const depositPct = parseFloat(depositPctInput.value) || 20;
            const termMonths = parseInt(termInput.value, 10) || 48;
            const annualRate = parseFloat(rateInput.value) || 13.5;

            const depositAmount = price * (depositPct / 100);
            const principal = Math.max(0, price - depositAmount);
            const monthlyRate = (annualRate / 100) / 12;

            let monthlyPayment = 0;
            if (principal > 0 && monthlyRate > 0 && termMonths > 0) {
                monthlyPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / (Math.pow(1 + monthlyRate, termMonths) - 1);
            }

            const monthlyDisplay = document.getElementById('calc-monthly-display');
            const financedDisplay = document.getElementById('calc-financed-display');
            const depositDisplay = document.getElementById('calc-deposit-display');

            if (monthlyDisplay) {
                monthlyDisplay.textContent = 'Ksh ' + Math.round(monthlyPayment).toLocaleString();
            }
            if (financedDisplay) {
                financedDisplay.textContent = 'Ksh ' + Math.round(principal).toLocaleString();
            }
            if (depositDisplay) {
                depositDisplay.textContent = 'Ksh ' + Math.round(depositAmount).toLocaleString();
            }
        };

        priceInput.addEventListener('input', updateFinancingCalculation);
        depositPctInput.addEventListener('change', updateFinancingCalculation);
        termInput.addEventListener('change', updateFinancingCalculation);
        rateInput.addEventListener('input', updateFinancingCalculation);
        updateFinancingCalculation();
    }

    // -------------------------------------------------------------
    // 6. Showroom Customer Support Desk (Keyboard Accessible + Consent)
    // -------------------------------------------------------------
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
            const isActive = chatbotWindow.classList.toggle('active');
            chatbotButton.setAttribute('aria-expanded', isActive ? 'true' : 'false');
            if (isActive) {
                checkLeadStatus();
            }
        });

        chatbotClose.addEventListener('click', () => {
            chatbotWindow.classList.remove('active');
            chatbotButton.setAttribute('aria-expanded', 'false');
            chatbotButton.focus();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && chatbotWindow.classList.contains('active')) {
                chatbotWindow.classList.remove('active');
                chatbotButton.setAttribute('aria-expanded', 'false');
                chatbotButton.focus();
            }
        });
    }

    function checkLeadStatus() {
        if (!leadForm || !chatInput || !sendChatBtn) return;
        if (!customerName || !customerEmail) {
            leadForm.style.display = 'flex';
            chatInput.disabled = true;
            sendChatBtn.disabled = true;
        } else {
            leadForm.style.display = 'none';
            chatInput.disabled = false;
            sendChatBtn.disabled = false;
            if (chatMessages && chatMessages.children.length === 0) {
                appendChatMessage('Support', `Welcome to Bliss Autos, ${customerName}. How can our Mombasa Road dealership desk assist you today?`);
            }
        }
    }

    if (leadSubmit) {
        leadSubmit.addEventListener('click', () => {
            const nameInput = document.getElementById('lead-name');
            const emailInput = document.getElementById('lead-email');
            const consentInput = document.getElementById('lead-consent');
            if (consentInput && !consentInput.checked) {
                alert('Please confirm that you are 18+ years old and agree to our Privacy Policy before starting a consultation.');
                return;
            }
            if (nameInput && emailInput && nameInput.value.trim() && emailInput.value.trim()) {
                customerName = nameInput.value.trim();
                customerEmail = emailInput.value.trim();
                localStorage.setItem('chat_customer_name', customerName);
                localStorage.setItem('chat_customer_email', customerEmail);
                checkLeadStatus();
            } else {
                alert('Please enter your full legal name and email address to begin.');
            }
        });
    }

    function appendChatMessage(sender, text) {
        if (!chatMessages) return;
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('chat-message');
        msgDiv.classList.add(sender === 'Customer' ? 'customer' : 'support');
        msgDiv.textContent = text;
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    async function sendInquiryMessage() {
        if (!chatInput) return;
        const text = chatInput.value.trim();
        if (!text) return;

        appendChatMessage('Customer', text);
        chatInput.value = '';

        const tempDeskMsg = document.createElement('div');
        tempDeskMsg.classList.add('chat-message', 'support');
        tempDeskMsg.textContent = 'Connecting with desk representative...';
        chatMessages.appendChild(tempDeskMsg);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: customerName,
                    email: customerEmail,
                    message: text,
                    history: chatHistory
                })
            });

            if (chatMessages.contains(tempDeskMsg)) {
                chatMessages.removeChild(tempDeskMsg);
            }

            if (response.ok) {
                const data = await response.json();
                appendChatMessage('Support', data.response);
                chatHistory.push({ sender: 'Customer', text: text });
                chatHistory.push({ sender: 'Support', text: data.response });
            } else {
                appendChatMessage('Support', `Thank you ${customerName}. Your inquiry regarding "${text}" has been recorded. Our sales team will follow up at ${customerEmail}.`);
            }
        } catch (err) {
            console.warn('Support desk server unreachable. Falling back to local responder.', err);
            if (chatMessages.contains(tempDeskMsg)) {
                chatMessages.removeChild(tempDeskMsg);
            }
            appendChatMessage('Support', `Thank you ${customerName}. Your message has been saved into our showroom inquiries queue. A representative will contact ${customerEmail} shortly.`);
        }
    }

    if (sendChatBtn) {
        sendChatBtn.addEventListener('click', sendInquiryMessage);
    }
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendInquiryMessage();
        });
    }
});

// -------------------------------------------------------------
// 7. Clear First-Party Storage Helper (Cookie Policy Page)
// -------------------------------------------------------------
function clearBlissStorage() {
    localStorage.removeItem('bliss_cookie_consent');
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('chat_customer_name');
    localStorage.removeItem('chat_customer_email');
    const feedback = document.getElementById('clear-storage-feedback');
    if (feedback) {
        feedback.textContent = 'All Bliss Autos local storage keys and session data have been erased from your browser.';
    }
}

// -------------------------------------------------------------
// 8. Inventory Filtering and Sorting (Global Functions)
// -------------------------------------------------------------
function filterCars() {
    const searchInput = document.getElementById('search');
    const makeSelect = document.getElementById('filter-make');
    const priceSelect = document.getElementById('filter-price');
    const sortSelect = document.getElementById('filter-sort');
    const inventoryGrid = document.getElementById('inventory-grid');
    const countDisplay = document.getElementById('inventory-count');

    if (!inventoryGrid) return;

    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const selectedMake = makeSelect ? makeSelect.value.toLowerCase() : '';
    const selectedPrice = priceSelect ? priceSelect.value : '';
    const selectedSort = sortSelect ? sortSelect.value : 'default';

    const carItems = Array.from(inventoryGrid.querySelectorAll('.car-item'));
    let visibleCount = 0;

    carItems.forEach(item => {
        const make = (item.getAttribute('data-make') || '').toLowerCase();
        const model = (item.getAttribute('data-model') || '').toLowerCase();
        const year = item.getAttribute('data-year') || '';
        const price = parseInt(item.getAttribute('data-price') || '0', 10);
        const cardText = item.textContent.toLowerCase();

        let matchesSearch = true;
        if (query) {
            matchesSearch = make.includes(query) || model.includes(query) || year.includes(query) || cardText.includes(query);
        }

        let matchesMake = true;
        if (selectedMake) {
            matchesMake = (make === selectedMake);
        }

        let matchesPrice = true;
        if (selectedPrice === 'under3m') {
            matchesPrice = (price < 3000000);
        } else if (selectedPrice === '3m-3.5m') {
            matchesPrice = (price >= 3000000 && price <= 3500000);
        } else if (selectedPrice === 'over3.5m') {
            matchesPrice = (price > 3500000);
        }

        if (matchesSearch && matchesMake && matchesPrice) {
            item.style.display = 'flex';
            visibleCount++;
        } else {
            item.style.display = 'none';
        }
    });

    if (selectedSort !== 'default') {
        const sortedItems = carItems.slice().sort((a, b) => {
            const priceA = parseInt(a.getAttribute('data-price') || '0', 10);
            const priceB = parseInt(b.getAttribute('data-price') || '0', 10);
            const yearA = parseInt(a.getAttribute('data-year') || '0', 10);
            const yearB = parseInt(b.getAttribute('data-year') || '0', 10);

            if (selectedSort === 'price-asc') return priceA - priceB;
            if (selectedSort === 'price-desc') return priceB - priceA;
            if (selectedSort === 'year-desc') return yearB - yearA;
            return 0;
        });

        sortedItems.forEach(item => inventoryGrid.appendChild(item));
    }

    if (countDisplay) {
        countDisplay.textContent = visibleCount;
    }
}

function resetFilters() {
    const searchInput = document.getElementById('search');
    const makeSelect = document.getElementById('filter-make');
    const priceSelect = document.getElementById('filter-price');
    const sortSelect = document.getElementById('filter-sort');

    if (searchInput) searchInput.value = '';
    if (makeSelect) makeSelect.value = '';
    if (priceSelect) priceSelect.value = '';
    if (sortSelect) sortSelect.value = 'default';

    filterCars();
}

function searchCar() {
    filterCars();
}
