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




    function gameLoop() {

        var nextPosition = getNextPosition();

        // Remove the tail of the snake
        snakeBody.pop();

        // Add the next position
        // to the front of our snakeBody
        snakeBody.unshift(nextPosition);

        getNextPosition();
        checkGameOver();
        checkEatFood();
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
    function checkGameOver() {}

    // Check if snake is on the same space as food
    function checkEatFood() {}

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



    function paintCanvas() {
        // Lets fill in the canvas colors
        canvasContext.fillStyle = '#333';
        canvasContext.fillRect(0, 0, width, height);
        canvasContext.strokeStyle = "black";
        canvasContext.strokeRect(0, 0, width, height);
        //paint snake
        for (var i = 0; i < snakeBody.length; i++) {
            var cell = snakeBody[i];
            paintCell(cell.x, cell.y);
        }
    }

    //paint cells
    function paintCell(x, y) {
        canvasContext.fillStyle = "#49E20E";
        canvasContext.fillRect(x * cellWidth, y * cellWidth, cellWidth, cellWidth);
        canvasContext.strokeStyle = "black";
        canvasContext.strokeRect(x * cellWidth, y * cellWidth, cellWidth, cellWidth);
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
        currentDirection = "right";
        gameLoopInterval = setInterval(gameLoop, 60);
    }

    startGame();


});