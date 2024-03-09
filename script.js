var currWord = '';
var incorrect = 0;
var finished = 0;

function printWord(word) {
	if (document.getElementById("cheatMode").checked) alert(word);
}

function startGame() {
	// Fetch a new word from the server
	finished = 0;
	fetch('getWord.php')
		.then(response => response.json())
		.then(data => {
			if(data.word) {
				printWord(data.word);
				setupGame(data.word);
			} else {
				console.error('Error fetching word:', data.error);
			}
		})
		.catch(error => console.error('Error:', error));
}

function setupGame(word) {
	const wordToGuess = document.getElementById('wordToGuess');
	currWord = word;
	wordToGuess.innerHTML = '_ '.repeat(word.length).trim();
	generateLetterButtons();
}

function drawGallow(gallow) {
	gallow.innerHTML = ''; // Clear previous image
	const hang = document.createElement('img');
	hang.src = "ind" + incorrect + ".png";
	gallow.appendChild(hang);
}

function generateLetterButtons() {
	const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	const lettersDiv = document.getElementById('letters');
	lettersDiv.innerHTML = ''; // Clear previous buttons
	
	var j = 0;
	
	var grid = "<table id=\"letterTable\">";
    for(row = 0; row < 6; row++) {
        grid += "<tr>";
        for(col = 0; col < 5; col++) {
            if (j < 26) {
				grid += "<td>";
				grid += "<button onclick=guessLetter(\"" + letters[j] + "\")>" + letters[j] + "</button>"
				j++;
				grid += "</td>"; 
			}
        }
        grid += "</tr>";
    }
    lettersDiv.innerHTML = grid;
	
	
	drawGallow(document.getElementById('gallow'));
}

function guessLetter(letter) {
	if (finished == 1) return;
	
	// Implement the guessing logic here
	console.log('Guessed letter:', letter);
	var i = 0;
	var found = 0;
	var remaining = 0;
	var dispStr = wordToGuess.innerHTML;
	var newStr = '';
	
	currWord.split('').forEach(lttr => {
		if (lttr.toUpperCase() == letter) {
			newStr += letter;
			found++;
		} else {
			newStr += dispStr[2*i];
			if (dispStr[2*i] == "_") remaining++;
		}
		i++;
		newStr += ' ';
	});
	wordToGuess.innerHTML = newStr;
	if (found == 0) {
		//alert("No " + letter);
		incorrect++;
		drawGallow(document.getElementById('gallow'));
		if (incorrect == 12) {
			alert("Sorry. Too many guesses used.");
			finished = 1;
		}
	}
	if (remaining == 0) {
		//Word Finished
		alert("Congratulations!");
		finished = 1;
	}
}

// Initially start the game
startGame();
