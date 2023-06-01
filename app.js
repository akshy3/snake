
      // Snake game logic
      const canvas = document.getElementById("canvas");
      const ctx = canvas.getContext("2d");
      const box = 20;
      const canvasSize = 20;
      let score = 0;
      let snake = [];
      snake[0] = { x: 10 * box, y: 10 * box };
      let food = {
        x: Math.floor(Math.random() * canvasSize) * box,
        y: Math.floor(Math.random() * canvasSize) * box,
      };
      let d;
      document.addEventListener("keydown", direction);

      function direction(event) {
        if (event.keyCode === 37 && d !== "RIGHT") {
          d = "LEFT";
        } else if (event.keyCode === 38 && d !== "DOWN") {
          d = "UP";
        } else if (event.keyCode === 39 && d !== "LEFT") {
          d = "RIGHT";
        } else if (event.keyCode === 40 && d !== "UP") {
          d = "DOWN";
        }
      }

      function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw snake
        for (let i = 0; i < snake.length; i++) {
          ctx.fillStyle = i === 0 ? "white" : "yellow";
          ctx.fillRect(snake[i].x, snake[i].y, box, box);

          ctx.strokeStyle = "white";
          ctx.strokeRect(snake[i].x, snake[i].y, box, box);
        }

        // Draw food
        ctx.fillStyle = "red";
        ctx.fillRect(food.x, food.y, box, box);

        // Move snake
        let snakeX = snake[0].x;
        let snakeY = snake[0].y;

        if (d === "LEFT") snakeX -= box;
        if (d === "UP") snakeY -= box;
        if (d === "RIGHT") snakeX += box;
        if (d === "DOWN") snakeY += box;

        // Check collision with food
        if (snakeX === food.x && snakeY === food.y) {
          score++;
          food = {
            x: Math.floor(Math.random() * canvasSize) * box,
            y: Math.floor(Math.random() * canvasSize) * box,
          };
        } else {
          snake.pop();
        }

        // Check collision with walls or self
        if (
          snakeX < 0 ||
          snakeY < 0 ||
          snakeX >= canvasSize * box ||
          snakeY >= canvasSize * box ||
          collision(snakeX, snakeY, snake)
        ) {
          clearInterval(game);
        }

        // Add new head to the snake
        const newHead = { x: snakeX, y: snakeY };
        snake.unshift(newHead);

        // Draw score
        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        ctx.fillText("Score: " + score, box, box);
      }

      function collision(x, y, array) {
        for (let i = 0; i < array.length; i++) {
            if (x === array[i].x && y === array[i].y) {
                return true;
              }
            }
            return false;
          }
    
          // Game loop
          let game = setInterval(draw, 100);
