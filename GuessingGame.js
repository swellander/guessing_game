function generateWinningNumber() {
    return Math.floor(Math.random() * 100 + 1) ;
}
function shuffle(arr) {
    let index, placeHolder;
    let cardsToBeShuffled = arr.length;
    while (cardsToBeShuffled) {
        i = Math.floor(Math.random() * cardsToBeShuffled);
        placeHolder = arr[i];
        arr[i] = arr[cardsToBeShuffled - 1];
        arr[cardsToBeShuffled - 1] = placeHolder;
        cardsToBeShuffled--;
    }
    return arr;
}
function Game() {
    this.playersGuess = null;
    this.pastGuesses = [];
    this.winningNumber = generateWinningNumber();
}

Game.prototype.difference = function() {
    return Math.abs(this.playersGuess - this.winningNumber);
}
Game.prototype.isLower = function() {
    return this.playersGuess - this.winningNumber < 0;
}
Game.prototype.playersGuessSubmission = function(num) {
    if ((num < 1 || num > 100) || typeof num !== 'number') {
        throw("That is an invalid guess.");
    } else {
        this.playersGuess = num;
    }
    return this.checkGuess(num);
}  

Game.prototype.checkGuess = function(guess) {
    let message;
    if (this.winningNumber === guess) {
        return 'You Win!';
    } else if (this.pastGuesses.indexOf(guess) !== -1) {
        message = 'You have already guessed that number.';
    } else if (this.difference() < 10) {
        message = 'You\'re burning up!';
    } else if (this.difference() < 25) {
        message = 'You\'re lukewarm.';
    } else if (this.difference() < 50) {
        message = 'You\'re a bit chilly.';
    } else {
        message = 'You\'re ice cold!';
    }
    this.pastGuesses.push(guess);
    if (this.pastGuesses.length === 5) message = 'You Lose.';
    return message;
} 
function newGame() {
    return new Game();
}

Game.prototype.provideHint = function() {
    let hints = [this.winningNumber];
    for (let i = 0; i < 2; i++) {
        hints.push(generateWinningNumber());
    }
    return shuffle(hints);
}

$(document).ready(event => {
    //materialize tooltip initialization
    $('.tooltipped').tooltip();

    //create new game instance
    let game = new Game();
    let header = $('#headers h1');
    let subHeader = $("#headers h3");
    //handle guess submission
    function handleGuessSubmission() {
        let input = $("#player-input");
        let numberChoice = input.val();
        
        //clear guess input  
        input.val('');

        //convert string value to number
        numberChoice = Number(numberChoice);

        let result = game.playersGuessSubmission(numberChoice);
        if (result === 'You have already guessed that number.') {
            header.text('You tried that one already...');
        } else if (result === 'You Win!') {
            header.text(result);
            $('#submit').toggleClass("disabled");
            $('#hint').addClass("disabled");
            document.getElementById("player-input").disabled = true;
            $('#headers h3').text('Click Reset button to play again');
        } else {

            let tip = '';

            game.isLower(game.playersGuess) ? tip = 'higher' : tip = 'lower';
            header.text(result);
            subHeader.text('Try ' + tip);
            n = game.pastGuesses.length;
            $(`#guesses ul li:nth-child(${n}) p`).text(String(game.playersGuess));
        }

        if (result === 'You Lose.') {
            header.text(result);
            $('#submit').addClass("disabled");
            document.getElementById("player-input").disabled = true;
            $('#headers h3').text('Click Reset to play again');
            $('#hint').addClass("disabled");
        }
    }

    //grab the number that the user chose by pressing submit button
    $('#submit').on('click', () => {
        handleGuessSubmission();
    });
    
    $("#player-input").keypress((event) => {
        if (event.which == 13) handleGuessSubmission();
    });

    //RESET BTN
    $("#reset").click(() => {
        //new game instance
        game = new Game();

        //reset headers
        header.text('G | G');
        subHeader.text('Pick a number between 1 and 100')

        //reset btns
        $('#submit').removeClass("disabled");
        $('#hint').removeClass("disabled");
        document.getElementById("player-input").disabled = false;

        $("#guesses ul li p").each(function(index, value) {
            $(this).text('-');
        })
    })
})