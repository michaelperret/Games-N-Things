/**
 * Created by Michael on 8/4/14.
 */
$(document).ready(function () {
    var snakeBody;
    var cellWidth = 10;

    var canvas = $("#canvas")[0];
    var canvasContext = canvas.getContext("2d");
    var width = $("#canvas").width();
    var height = $("#canvas").height();
    var currentDirection;
    var speed = 100;
    var food, food2, food3;
    var play = true;
    var highScore = 0;
    var score;
    var scoreData;

    //increment speed
    var incSpeed = function(){
        if(speed>25){
            speed = speed-5;
        }
    };

    // Create a random piece of food
    function createFood() {
        food = {
            x: Math.round(Math.random() * (width - cellWidth) / cellWidth),
            y: Math.round(Math.random() * (height - cellWidth) / cellWidth)
        };
//
    }


    function gameLoop() {

        var nextPosition = getNextPosition();
        if(checkGameOver(nextPosition,snakeBody)){
            gameOver();
            return;
        }
        var ateFood = checkEatFood(nextPosition);
        if(!ateFood) {
            // Remove the tail of the snake, only if we didn't eat food this time around
            snakeBody.pop();
        }



        // Add the next position
        // to the front of our snakeBody
        snakeBody.unshift(nextPosition);

        getNextPosition();

        paintCanvas();

    }

    // Get the next position of the snake
    function getNextPosition() {
        var currentPosition = snakeBody[0];
        var nextPosition = {
            x: currentPosition.x,
            y: currentPosition.y
        };

        // Increment the x or y value depending on what
        // direction the snake is going
        if (currentDirection == "right") nextPosition.x++;
        else if (currentDirection == "left") nextPosition.x--;
        else if (currentDirection == "up") nextPosition.y--;
        else if (currentDirection == "down") nextPosition.y++;

        return nextPosition;
    }






    // Check if snake has collided with walls or itself
    function checkGameOver(position, snakeBody) {
        if(position.x == -1 || position.x == width / cellWidth) {
            // If the snake has gone off the left or right boundaries, game over!
            return true;
        } else if(position.y == -1 || position.y == height / cellWidth) {
            // If the snake has gone off the top or bottom boundaries, game over!
            return true;
        } else {
            // If the snake's next position collides with another cell in it's body, game over!
            for (var i = 0; i < snakeBody.length; i++) {
                if (snakeBody[i].x == position.x && snakeBody[i].y == position.y) {
                    return true;
                }
            }
            return false;
        }
    }


    // Check if snake is on the same space as food
    function checkEatFood(position) {
        if (position.x == food.x && position.y == food.y) {  // The snake is eating the food
            // Create a new piece of food, which removes this current one
            createFood();
            score++;
            incSpeed();
            clearInterval(gameLoopInterval);
            gameLoopInterval = setInterval(gameLoop, speed);
            return true;

        }
//          if(position.x == food2.x && position.y == food2.y){
//            createFood();
//            score+=2;
//            return true
//        }
        else {
            return false;
        }
    }
    // Paint the snake and food

    function createSnake() {
        // Starting length of the snake will be 5 cells
        var length = 5;

        // Let's set the snake body back to an empty array
        snakeBody = [];

        // Add cells to the snake body starting from the top left hand corner of the screen
        for (var i = length - 1; i >= 0; i--) {
            snakeBody.push({x: i, y: 0});
        }
    }

    function gameOver(){
        clearInterval(gameLoopInterval);

        if(score>highScore){
            highScore = score;
            scoreData = {
                score: highScore
            };
            postScore();
        }
        play = confirm('GAME OVER BITCHES\nClick "OK" to play again');
        if(play){
            startGame();
        }else{
            console.log("poop");
        }
//        console.log(poop);
    }

//    function getDBHighScore() {
//        $.ajax(
//            url:
//        )
//    }

    function postScore() {

        scoreData = JSON.stringify(scoreData);
        $.ajax({
            url: '/postscore/',
            type: 'POST',
            dataType: 'json',
            data: scoreData,
            success: function(response) {
                console.log(response);
            },
            error: function(response){
                console.log("OH FUCK: " + response)
            }
        });
    }


    function paintCanvas() {
        // Lets fill in the canvas colors
        canvasContext.fillStyle = '#333';
        canvasContext.fillRect(0, 0, width, height);
        canvasContext.strokeStyle = "black";
        canvasContext.strokeRect(0, 0, width, height);
        //paint snake
        for (var i = 0; i < snakeBody.length; i++) {
            var cell = snakeBody[i];
            if(i===0){
                paintHead(cell.x,cell.y)
            }else{
                paintCell(cell.x, cell.y);
            }
        }



        var scoreText = "High Score: " + highScore + " Current Score: "+ score;
        canvasContext.fillText(scoreText, 5, height - 5);
        paintFood(food.x, food.y);
    }

    //paint cells
    function paintCell(x, y) {
        canvasContext.fillStyle = "#49E20E";
        canvasContext.fillRect(x * cellWidth, y * cellWidth, cellWidth, cellWidth);
        canvasContext.strokeStyle = "black";
        canvasContext.strokeRect(x * cellWidth, y * cellWidth, cellWidth, cellWidth);
    }

    function paintFood(x,y) {
        canvasContext.fillStyle = "red";
        canvasContext.fillRect(x * cellWidth, y * cellWidth, cellWidth, cellWidth);
        canvasContext.strokeStyle = "black";
        canvasContext.strokeRect(x * cellWidth, y * cellWidth, cellWidth, cellWidth);
    }

    function paintHead(x,y){
        canvasContext.fillStyle = "blue";
        canvasContext.fillRect(x*cellWidth,y*cellWidth,cellWidth,cellWidth);
        canvasContext.strokeStyle = "black";
        canvasContext.strokeRect(x*cellWidth,y*cellWidth, cellWidth,cellWidth);
    }

    var gameLoopInterval;

    $(document).keydown(function (e) {
        var key = e.which;

        // This will change the direction of the snake
        // Make sure we check that the user isn't trying to have the snake go backwards
        if (key == "37" && currentDirection != "right") currentDirection = "left";
        else if (key == "38" && currentDirection != "down") currentDirection = "up";
        else if (key == "39" && currentDirection != "left") currentDirection = "right";
        else if (key == "40" && currentDirection != "up") currentDirection = "down";
    });






    function startGame() {
        // Let's set the game loop to run every 60 milliseconds
        createSnake();
        speed = 100;
        currentDirection = "right";
        createFood();
        score = 0;
        clearInterval(gameLoopInterval);

        gameLoopInterval = setInterval(gameLoop, speed);
    }

    $('#startGame').one('click', function(){

        startGame()

    });





});