package api

import (
	authController "github.com/alexkalak/todos/backend-src/api/authorization/controllers"
	todoController "github.com/alexkalak/todos/backend-src/api/todo/controllers"
	"github.com/gofiber/fiber/v2"
)

func ApiRouter(router fiber.Router) {
	router.Route("/todos", todoController.TodoController)
	router.Route("/auth", authController.AuthController)
}
