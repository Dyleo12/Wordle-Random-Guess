document.addEventListener('click', function (event) {

    if (event.target && event.target.getAttribute('data-testid') === 'Play') {
        const newButton = document.createElement('button');
        newButton.style.position = 'block';
        newButton.style.margin = 'auto';
        newButton.style.height = '40px';
        newButton.style.width = '175px';
        newButton.textContent = 'Random Word';
        newButton.style.marginBottom = '80px';
        newButton.style.fontFamily = 'Helvetica';
        newButton.style.fontWeight = 'bold';
        newButton.style.fontSize = '16px';
        newButton.style.color = 'white';
        newButton.style.backgroundColor = '#818384';
        newButton.style.left = '50%';


        let element = document.querySelector('.Board-module_boardContainer__TBHNL');

        element.insertAdjacentElement('afterend', newButton);

        newButton.addEventListener('click', async function () {

            // Clear typed letters
            clearGuess();

            try {
                const inputSequence = await getRandomWord();
                if (!inputSequence) {
                    console.error('Failed to fetch or process the random word.');
                    return;
                }
                console.log('Random Word:', inputSequence);
                inputSequence.split('').forEach(char => {
                    const keyboardEvent = new KeyboardEvent('keydown', {
                        bubbles: true,
                        cancelable: true,
                        key: char
                    });
                    document.dispatchEvent(keyboardEvent);
                });
            } catch (error) {
                console.error('Error processing the random word:', error);
            }
        });
    }
});

async function getRandomWord() {
    try {
        const response = await fetch(chrome.runtime.getURL('combined_wordlist.txt'));
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        const words = text.split('\n').map(word => word.trim()).filter(word => word.length > 0);
        if (words.length === 0) {
            throw new Error('Word list is empty or improperly formatted.');
        }
        const randomWord = words[Math.floor(Math.random() * words.length)];
        return randomWord;
    } catch (error) {
        console.error('Error fetching the file:', error);
        return null;
    }
}

function clearGuess() {
    document.body.focus();

    // Dispatch the backspace key event multiple times
    for (let i = 0; i < 5; i++) {
        let event = new KeyboardEvent('keydown', {
            key: 'Backspace',
            keyCode: 8,
            which: 8,
            bubbles: true
        });
        document.dispatchEvent(event);
    }
}

