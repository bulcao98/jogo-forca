var WORD = "";

document.addEventListener("DOMContentLoaded", async function () {
    const WORDS = await fetch("./words.json").then(response => response.json());

    const bodyParts = document.querySelectorAll(".body-part");
    bodyParts.forEach(part => {
        part.style.display = "none";
    });

    // Seleciona uma palavra aleatória do array WORDS
    WORD = WORDS[Math.floor(Math.random() * WORDS.length)].toUpperCase();

    // Seleciona a div #word
    const wordDiv = document.getElementById("word");

    // Preenche a div #word com um _ para cada letra da palavra
    for (let i = 0; i < WORD.length; i++) {
        const letterSpan = document.createElement("span");
        letterSpan.classList.add("letter");
        wordDiv.appendChild(letterSpan);
    }

});

function removeAccents(word) {
    return word.normalize("NFD").replace(/[^a-zA-Z\s]/g, "");
}

function guessWord() {
    const guessInput = document.getElementById("guess-input").value.toUpperCase();

    if (guessInput.length == 0) return;

    var guessInputNoAccent = removeAccents(guessInput);
    if (guessInputNoAccent === removeAccents(WORD)) {
        modal("Parabéns, você ganhou! A palavra é " + WORD);
        // Redireciona para uma página de vitória ou reinicia o jogo
        // Completa a palavra no letters
        const wordDiv = document.getElementById("word");
        const letters = wordDiv.getElementsByClassName("letter");
        for (let i = 0; i < WORD.length; i++) {
            letters[i].innerText = WORD[i];
        }
    } else {
        // Completa duas partes do boneco
        const bodyParts = document.querySelectorAll(".body-part");
        let partesVisiveis = 0;
        for (let part of bodyParts) {
            if (part.style.display === "none") {
                part.style.display = "block";
                partesVisiveis++;
                if (partesVisiveis === 2) break;
            }
        }

        let ultimaParteVisivel = !Array.from(bodyParts).some(part => part.style.display === "none");
        if (ultimaParteVisivel) {
            // Se a última parte do boneco estiver visível, finaliza a rodada
            modal("Você perdeu! A palavra era " + WORD);
            // Redireciona para uma página de derrota ou reinicia o jogo
        }
    }
}


document.addEventListener("keydown", function (event) {


    if (document.activeElement === document.getElementById("guess-input")) {
        if (event.key === "Enter") {
            guessWord();
        }
        return;
    }
    const key = event.key.toUpperCase();
    const wordDiv = document.getElementById("word");
    const letters = wordDiv.getElementsByClassName("letter");
    const usedLettersDiv = document.getElementById("used-letters");
    let found = false;

    // Verifica se a tecla pressionada é uma letra
    if (key.length === 1 && key.match(/[A-Z]/i)) {
        // Verifica se a letra já foi usada
        if (!usedLettersDiv.innerText.includes(key)) {
            // Adiciona a letra à lista de letras usadas
            const usedLetterSpan = document.createElement("span");
            usedLetterSpan.classList.add("used-letter");
            usedLetterSpan.innerText = key;
            usedLettersDiv.appendChild(usedLetterSpan);

            // Verifica se a letra está na palavra
            for (let i = 0; i < WORD.length; i++) {
                if (removeAccents(WORD[i]) === key) {
                    letters[i].innerText = WORD[i];
                    found = true;
                }
            }

            // Se a letra não estiver na palavra, mostra a próxima parte do corpo
            if (!found) {
                const bodyParts = document.querySelectorAll(".body-part");
                let bodyPartShown = false;
                for (let part of bodyParts) {
                    if (part.style.display === "none") {
                        part.style.display = "block";
                        bodyPartShown = true;
                        break;
                    }
                }

                // Verifica se ainda há partes do corpo para mostrar
                let remainingBodyParts = false;
                for (let part of bodyParts) {
                    if (part.style.display === "none") {
                        remainingBodyParts = true;
                        break;
                    }
                }

                // Se não houver mais partes do corpo para mostrar, exibe a mensagem de derrota
                if (!remainingBodyParts) {
                    modal("Você perdeu! A palavra era " + WORD);
                }
            }

            // Verifica se o jogador ganhou
            let allLettersRevealed = true;
            for (let letter of letters) {
                if (letter.innerText === "") {
                    allLettersRevealed = false;
                    break;
                }
            }

            if (allLettersRevealed) {
                modal("Parabéns, você ganhou! A palavra é " + WORD);
            }
        }
    }
});

function guessLetter(letter) {
    let event = new KeyboardEvent('keydown', {
        'key': letter,
        'code': 'Key' + letter.charCodeAt(0),
        'keyCode': letter.charCodeAt(0),
        'which': letter.charCodeAt(0)
    });
    document.dispatchEvent(event);
}



function modal(message) {
    const modal = document.createElement("div");
    modal.style.position = "fixed";
    modal.style.top = "0";
    modal.style.left = "0";
    modal.style.width = "100%";
    modal.style.height = "100%";
    modal.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    modal.style.display = "flex";
    modal.style.justifyContent = "center";
    modal.style.alignItems = "center";
    modal.style.zIndex = "1000";

    const modalContent = document.createElement("div");
    modalContent.style.backgroundColor = "#fff";
    modalContent.style.padding = "20px";
    modalContent.style.borderRadius = "5px";
    modalContent.style.position = "relative";
    modalContent.style.top = "-25%";
    modalContent.style.textAlign = "center";

    const modalMessage = document.createElement("p");
    modalMessage.innerText = message;
    modalMessage.style.fontSize = "2em";
    modalContent.appendChild(modalMessage);

    const modalButton = document.createElement("button");
    modalButton.innerText = "Jogar Novamente";
    modalButton.style.backgroundColor = "#654321";
    modalButton.style.color = "#f7e9d7";
    modalButton.style.padding = "10px 20px";
    modalButton.style.border = "none";
    modalButton.style.borderRadius = "5px";
    modalButton.style.fontSize = "1.2em";
    modalButton.style.cursor = "pointer";
    modalButton.addEventListener("click", function () {
        location.reload();
    });
    modalContent.appendChild(modalButton);

    modal.appendChild(modalContent);
    document.body.appendChild(modal);
}


