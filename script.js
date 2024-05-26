document.addEventListener('DOMContentLoaded', () => {
    const startMenu = document.getElementById('start-menu');
    const adviceDisplay = document.getElementById('advice-display');
    const searchMenu = document.getElementById('search-menu');
    const inspireMeBtn = document.getElementById('inspire-me-btn');
    const searchBtn = document.getElementById('search-btn');
    const newAdviceBtn = document.getElementById('new-advice-btn');
    const goBackBtn = document.getElementById('go-back-btn');
    const searchInput = document.getElementById('search-input');
    const searchInspireBtn = document.getElementById('search-inspire-btn');
    const adviceText = document.getElementById('advice-text');
    const adviceId = document.getElementById('advice-id');
    const errorMessage = document.getElementById('error-message');

    const fetchAdvice = async (id = null) => {
        const url = id ? `https://api.adviceslip.com/advice/${id}` : 'https://api.adviceslip.com/advice';
        const response = await fetch(url);
        const data = await response.json();
        return data;
    };

    const displayAdvice = (advice, id) => {
        adviceText.textContent = `"${advice}"`;
        adviceId.textContent = `ID: ${id}`;
        fadeTransition(adviceDisplay, true);
    };

    const fadeTransition = (element, fadeIn) => {
        element.classList.remove('fade-in', 'fade-out', 'hidden');
        if (fadeIn) {
            element.classList.add('fade-in');
        } else {
            element.classList.add('fade-out');
            setTimeout(() => element.classList.add('hidden'), 500);
        }
    };

    const fadeQuoteTransition = async () => {
        adviceText.classList.add('fade-out');
        adviceId.classList.add('fade-out');
        await new Promise(resolve => setTimeout(resolve, 500)); // wait for the fade-out animation to complete
        const data = await fetchAdvice();
        adviceText.textContent = `"${data.slip.advice}"`;
        adviceId.textContent = `ID: ${data.slip.id}`;
        adviceText.classList.remove('fade-out');
        adviceId.classList.remove('fade-out');
        adviceText.classList.add('fade-in');
        adviceId.classList.add('fade-in');
    };

    inspireMeBtn.addEventListener('click', async () => {
        fadeTransition(startMenu, false);
        setTimeout(async () => {
            const data = await fetchAdvice();
            displayAdvice(data.slip.advice, data.slip.id);
        }, 500);
    });

    searchBtn.addEventListener('click', () => {
        fadeTransition(startMenu, false);
        setTimeout(() => {
            fadeTransition(searchMenu, true);
        }, 500);
    });

    newAdviceBtn.addEventListener('click', fadeQuoteTransition);

    goBackBtn.addEventListener('click', () => {
        fadeTransition(adviceDisplay, false);
        setTimeout(() => {
            fadeTransition(startMenu, true);
        }, 500);
    });

    searchInspireBtn.addEventListener('click', async () => {
        const id = searchInput.value;
        if (id) {
            const data = await fetchAdvice(id);
            if (data.message) {
                errorMessage.classList.remove('hidden');
            } else {
                errorMessage.classList.add('hidden');
                fadeTransition(searchMenu, false);
                setTimeout(() => {
                    displayAdvice(data.slip.advice, data.slip.id);
                }, 500);
            }
        }
    });
});
