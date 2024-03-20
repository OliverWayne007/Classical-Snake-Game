// Define HTML Elements that we are going to manipulate

// Getting the Game Board element
const gameBoard = document.getElementById("game-board");

// Getting the current score element
const currentScore = document.getElementById("currentScore");

// Getting the highest score element
const highestScore = document.getElementById("highestScore");

// console.log(window.getComputedStyle(gameBoard).getPropertyValue('display'));

// Define game variables
let gridSize = 20;
let snake = [ { x: 1 , y: 1} ];
let foodPosition = generateRandomFoodPosition();
// let foodPosition = { x: 10 , y: 10};
let direction = "right";
let gameInterval;
let gameSpeedDelay = 500;
let instructionText = document.getElementById("instruction-text");
let logo = document.getElementById("logo");
let gameStatus = "Not Started";
let gameRestarted = false;
let highestScoreValue = 0;

// Draw game map , snake , food
function draw()
{
    gameBoard.innerHTML = '';
    drawSnake();
    drawFood();
}

// Function to draw a snake
function drawSnake()
{
    snake.forEach( (position) => {
        const snakeElement = createGameElement('div' , 'snake');
        setPosition(snakeElement , position);
        //Adding the snake element to the game board
        gameBoard.appendChild(snakeElement);
    } );
}

// Creating a snake or food cube/div
function createGameElement(tag , className)
{
    const element = document.createElement(tag);
    // element.setAttribute("class" , className);
    element.className = className;
    return element;
}

// Set the position of snake or food
function setPosition(element , position)
{
    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;
}

// Generate Random Food Position
function generateRandomFoodPosition()
{
    const randomPosition = { x: Math.floor( (Math.random() * gridSize) + 1 ) , y: Math.floor( (Math.random() * gridSize) + 1 ) };
    return randomPosition;
}

// Function to draw a food element
function drawFood()
{
    const foodElement = createGameElement('div' , 'food');
    setPosition(foodElement , foodPosition);
    gameBoard.appendChild(foodElement);
}

// Function to move the fucking snake
function moveSnake()
{
    const snakeHeadPosition = { ...snake[0] };

    switch (direction) {

        case "right":
            snakeHeadPosition.x++;
            break;
        
        case "left":
            snakeHeadPosition.x--;
            break;

        case "up":
            snakeHeadPosition.y--;
            break;

        case "down":
            snakeHeadPosition.y++;
            break;
    
        default:
            break;

    }

    snake.unshift(snakeHeadPosition);

}

// Function to check for collision with the boundaries of the game board
function checkCollisionWithWall()
{
    const snakeHeadPosition = { ...snake[0] };
    if(snakeHeadPosition.x <= 0 || snakeHeadPosition.x > gridSize || snakeHeadPosition.y <= 0 || snakeHeadPosition.y > gridSize)
    {
        return true;
    }
    return false;
}

// Function to check for collision of the snake with itself
function checkSelfCollision()
{
    for(let i = 1 ; i < snake.length ; i++)
    {
        if(snake[i].x == snake[0].x && snake[i].y == snake[0].y)
        {
            return true;
        }
    }
    return false;
}

// Function to check for food consumption
function checkFoodConsumption()
{
    const snakeHeadPosition = { ...snake[0] };

    if(snakeHeadPosition.x == foodPosition.x && snakeHeadPosition.y == foodPosition.y)
    {
        foodPosition = generateRandomFoodPosition();
        updateCurrentScore();
        increaseSpeed();
        
        // ------------------------------------------------------------------------------------
        clearInterval(gameInterval); // Clear past interval
        gameInterval = setInterval( () => {
            moveSnake(); // Move the snake first
            if(checkCollisionWithWall() === true)
            {
                alert("Oops !!! Looks like you hit a wall !!!");
                restartGame();
            }
            else if(checkSelfCollision() === true)
            {
                alert("Holy Crap !!! You fucking ate yourself !!!");
                restartGame();
            }
            else
            {
                checkFoodConsumption();
                draw();  // Then draw the snake element at the new position
            }
        } , gameSpeedDelay);
        // ---------------------------------------------------------------------------------------

    }
    else
    {
        snake.pop();
    }
}

// Function to change the game speed delay
function increaseSpeed()
{
    if(gameSpeedDelay > 200)
    {
        gameSpeedDelay -= 50;
    }
    else if(gameSpeedDelay > 150)
    {
        gameSpeedDelay -= 10;
    }
    else if(gameSpeedDelay > 100)
    {
        gameSpeedDelay -= 5;
    }
    else if(gameSpeedDelay > 50)
    {
        gameSpeedDelay -= 3;
    }
    else
    {
        gameSpeedDelay -= 1;
    }
    console.log(gameSpeedDelay);
}


// Function to start the fucking game
function startGame()
{
    gameStatus = "Started";

    instructionText.style.display = "none";
    logo.style.display = "none";

    // Testing the draw function
    draw();

    // Testing the moveSnake function
    gameInterval = setInterval( () => {
        moveSnake(); // Move the snake first
        if(checkCollisionWithWall() === true)
        {
            alert("Oops !!! Looks like you hit a wall !!!");
            restartGame();
        }
        else if(checkSelfCollision() === true)
        {
            alert("Holy Crap !!! You fucking ate yourself !!!");
            restartGame();
        }
        else
        {
            checkFoodConsumption();
            draw();  // Then draw the snake element at the new position
        }
    } , gameSpeedDelay);
}


// Function to restart the game after collision
function restartGame()
{
    resetScores();
    clearInterval(gameInterval);
    gameRestarted = true;
    gameStatus = "Not Started";
    gameBoard.innerHTML = '';
    instructionText.style.display = "block";
    instructionText.innerText = "Press Enter key to restart the game";
    logo.style.display = "block";
    snake = [ {x: 1 , y: 1} ];
    direction = "right";
    gameSpeedDelay = 500;
}

// Function to update the current score on food consumption
function updateCurrentScore()
{
    const currentScoreValue = snake.length - 1;
    currentScore.textContent = currentScoreValue.toString().padStart(3 , '0');
}

// Function to reset the scores on game restart
function resetScores()
{
    // console.log(snake);
    let currentScoreValue = snake.length - 1;
    // console.log(currentScoreValue);
    highestScoreValue = Math.max(highestScoreValue , currentScoreValue);
    // console.log(highestScoreValue);
    currentScoreValue = 0;
    currentScore.textContent = currentScoreValue.toString().padStart(3 , '0');
    highestScore.textContent = highestScoreValue.toString().padStart(3 , '0');
    highestScore.style.display = "block";
}

// Event Listener to listen and handle keyboard inputs provided by the user
document.addEventListener("keydown" , (event) => {
    if(gameStatus === "Not Started")
    {
        // To start a new game with no highest score and before any collision, press "space bar"
        if(gameRestarted === false && (event.key === ' ' || event.code === "space"))
        {
            startGame();
        }
        // To restart a game after collision, press "Enter"
        else if(gameRestarted === true && event.key === 'Enter')
        {
            startGame();
        }
    }
    else
    {
        switch (event.code) {
            case "ArrowUp":
                direction = "up";
                break;

            case "ArrowDown":
                direction = "down";
                break;

            case "ArrowLeft":
                direction = "left";
                break;

            case "ArrowRight":
                direction = "right";
                break;
            
            default:
                break;
        }
    }
});