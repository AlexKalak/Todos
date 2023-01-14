package main

import (
	"fmt"

	"github.com/alexkalak/todos/db"
	todoRouter "github.com/alexkalak/todos/src/todo/controllers"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

type User struct {
	Id       int
	Username string
	Password string
	Email    string
	Posts_id int
}

func setupRoutes(app *fiber.App) {
	app.Route("/todos", todoRouter.TodoController)
}

func main() {
	app := fiber.New()
	_, err := db.GetConnection()
	if err != nil {
		fmt.Println(err.Error())
	}

	app.Use(cors.New())

	setupRoutes(app)

	app.Listen(":9999")
}