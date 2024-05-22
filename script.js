document.addEventListener('DOMContentLoaded', () => {
    const words = [
        "Nemuriko", "Dryad", "Water Element", "Skelengel", 
        "Dragon Treasure", "Dark Energy", "Horn of Light", "Beast Fangs", 
        "Malevolent Nuzzler", "Cyber Shield", "Widespread Ruin", "Crush Card", 
        "Ancient Jar", "Fiend's Hand", "LALA Li-oon", "Raigeki"
    ];

    const correctGroups = [
        ["Nemuriko", "Dryad", "Water Element", "Skelengel"],
        ["Dragon Treasure", "Dark Energy", "Horn of Light", "Beast Fangs"],
        ["Malevolent Nuzzler", "Cyber Shield", "Widespread Ruin", "Crush Card"],
        ["Ancient Jar", "Fiend's Hand", "LALA Li-oon", "Raigeki"]
    ];

    const groupReasons = [
        "Equipam Book of Secret Arts",
        "Equips de THTD",
        "Atec Nitemare",
        "Deck inicial"
    ];

    const groupColors = ["🟩", "🟧", "🟦", "🟪"];
    let shareString = "";

    const wordGrid = document.getElementById('word-grid');
    const resultDiv = document.getElementById('result');
    const attemptsDiv = document.getElementById('attempts');
    const shareButton = document.getElementById('share');
    let selectedWords = [];
    let correctCount = 0;
    let attempts = 0;
    let errors = 0;

    // Shuffle words
    words.sort(() => Math.random() - 0.5);

    // Create word elements
    words.forEach(word => {
        const wordElement = document.createElement('div');
        wordElement.classList.add('word');
        wordElement.textContent = word;
        wordElement.addEventListener('click', () => selectWord(wordElement));
        wordGrid.appendChild(wordElement);
    });

    function selectWord(wordElement) {
        if (wordElement.classList.contains('selected')) {
            wordElement.classList.remove('selected');
            selectedWords = selectedWords.filter(word => word !== wordElement.textContent);
        } else {
            wordElement.classList.add('selected');
            selectedWords.push(wordElement.textContent);
        }

        if (selectedWords.length === 4) {
            checkGroup();
        }
    }

    function checkGroup() {
        const selectedGroup = selectedWords.slice();
        selectedWords = [];

        const wordElements = document.querySelectorAll('.word');
        wordElements.forEach(wordElement => wordElement.classList.remove('selected'));

        let isCorrectGroup = false;
        let correctGroupIndex = -1;
        correctGroups.forEach((group, index) => {
            if (selectedGroup.every(word => group.includes(word))) {
                isCorrectGroup = true;
                correctGroupIndex = index;
            }
        });

        attempts++;
        attemptsDiv.textContent = `Tentativas: ${attempts}`;

        if (isCorrectGroup) {
            correctCount++;

            // Remove selected words from the grid
            selectedGroup.forEach(word => {
                const wordElement = Array.from(wordGrid.children).find(el => el.textContent === word);
                wordGrid.removeChild(wordElement);
            });

            // Create a new element to display the group and reason
            const groupElement = document.createElement('div');
            groupElement.classList.add('group-word', `correct-${correctCount - 1}`);
            groupElement.textContent = `${groupReasons[correctGroupIndex]}: ${selectedGroup.join(', ')}`;
            
            // Insert the group element in the correct position
            wordGrid.insertBefore(groupElement, wordGrid.children[correctCount - 1]);

            resultDiv.textContent = 'Grupo correto!';
            shareString += groupColors[correctCount - 1];

            if (correctCount === 4) {
                shareString += `\n\nJoguei conexo FM ${new Date().toLocaleDateString()} e consegui em ${attempts} tentativas.`;
                shareButton.style.display = 'block';
            }
        } else {
            resultDiv.textContent = 'Grupo incorreto. Tente novamente.';
            shareString += '❌';
            errors++;
        }

        if (attempts % 10 === 0) {
            shareString += '\n';
        }
    }

    shareButton.addEventListener('click', () => {
        navigator.clipboard.writeText(shareString)
            .then(() => {
                alert('Resultado copiado para a área de transferência!');
            })
            .catch(err => {
                console.error('Erro ao copiar: ', err);
                alert('Falha ao copiar. Por favor, tente novamente.');
            });
    });
});
