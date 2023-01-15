package controllers

import (
	"errors"
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
	router.Put("/:id<int>", updateTodoHandler)

}

func getAllTodosHandler(c *fiber.Ctx) error {
	todos := todoService.GetAllTodos()
	return c.JSON(&todos)
}

func saveTodoHandler(c *fiber.Ctx) error {
	todo, errors, err := todoService.SaveTodo(c)
	if err != nil {
		return c.JSON(`"ok":"false", "msg":"internal server error"`)
	}
	if errors != nil {
		return c.JSON(fiber.Map{
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
	return c.JSON(`"ok": false`)
}

func getTodoById(c *fiber.Ctx) error {
	todo, err := todoService.GetTodoById(c)

	if err != nil {
		switch {
		case errors.Is(err, globalerrors.ErrInternalServerError):
			return c.JSON(fiber.Map{
				"ok":  false,
				"msg": "An internal server error",
			})
		case errors.Is(err, todoerrors.ErrUserNotFound):
			return c.JSON(fiber.Map{
				"ok":  false,
				"msg": "User not found",
			})
		case errors.Is(err, todoerrors.ErrParseError):
			return c.JSON(fiber.Map{
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
	return c.JSON(fiber.Map{
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

func updateTodoHandler(c *fiber.Ctx) error {
	time.Sleep(time.Second)
	todo, validationErrors, err := todoService.UpdateTodo(c)
	if err != nil {
		return c.JSON(`"ok":"false", "msg":"internal server error"`)
	}
	if validationErrors != nil {
		return c.JSON(fiber.Map{
			"ok":     false,
			"errors": validationErrors,
		})
	}
	if todo != nil {
		return c.JSON(fiber.Map{
			"ok":   true,
			"todo": todo,
		})
	}
	return c.JSON(`"ok": false`)
}
