package controllers

import (
	"errors"
	"net/http"
	"time"

	globalerrors "github.com/alexkalak/todos/src/errors"
	todoerrors "github.com/alexkalak/todos/src/todo/errors"
	"github.com/alexkalak/todos/src/todo/services"
	"github.com/gofiber/fiber/v2"
)

var todoService = services.New()

func TodoController(router fiber.Router) {
	router.Get("/", getAllTodosHandler)
	router.Post("/", saveTodoHandler)

	router.Get("/:id<int>", getTodoById)
	router.Delete("/:id<int>", deleteTodoById)
}

func getAllTodosHandler(c *fiber.Ctx) error {
	todos := todoService.GetAllTodos()
	return c.JSON(&todos)
}

func saveTodoHandler(c *fiber.Ctx) error {
	todo, errors, err := todoService.SaveTodo(c)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(`"ok":"false", "msg":"internal server error"`)
	}
	if errors != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"ok":     false,
			"errors": errors,
		})
	}
	if todo != nil {
		return c.JSON(fiber.Map{
			"ok":   true,
			"todo": todo,
		})
	}
	return c.Status(http.StatusBadRequest).JSON(`"ok": false`)
}

func getTodoById(c *fiber.Ctx) error {
	todo, err := todoService.GetTodoById(c)

	if err != nil {
		switch {
		case errors.Is(err, globalerrors.ErrInternalServerError):
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
				"ok":  false,
				"msg": "An internal server error",
			})
		case errors.Is(err, todoerrors.ErrUserNotFound):
			return c.Status(http.StatusBadRequest).JSON(fiber.Map{
				"ok":  false,
				"msg": "User not found",
			})
		case errors.Is(err, todoerrors.ErrParseError):
			return c.Status(http.StatusBadRequest).JSON(fiber.Map{
				"ok":  false,
				"msg": "User id error",
			})
		}
	}
	if todo != nil {
		return c.JSON(fiber.Map{
			"ok":   true,
			"todo": todo,
		})
	}
	return c.Status(http.StatusBadRequest).JSON(fiber.Map{
		"ok": false,
	})
}

func deleteTodoById(c *fiber.Ctx) error {
	time.Sleep(time.Second * 5)
	value, err := todoService.DeleteTodoById(c)
	if err != nil {
		return c.JSON(fiber.Map{
			"ok":  false,
			"msg": err.Error(),
		})
	}

	if !value {
		return c.JSON(fiber.Map{
			"ok":  false,
			"msg": "some error occured",
		})
	}

	return c.JSON(fiber.Map{
		"ok": true,
	})
}
