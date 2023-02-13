package main

import (
	"fmt"

	"github.com/alexkalak/todos/backend-src/api"
	"github.com/alexkalak/todos/backend-src/web"
	"github.com/alexkalak/todos/db"
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
	app.Route("/api", api.ApiRouter)
	app.Route("/*", web.WebRouter)
}

func main() {
	app := fiber.New()
	_, err := db.GetConnection()
	if err != nil {
		fmt.Println(err.Error())
	}

	app.Static("/static", "build/static")

	app.Use(cors.New())

	setupRoutes(app)

	app.Listen(":9999")
}
