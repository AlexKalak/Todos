package controllers

import (
	"errors"
	"fmt"
	"net/http"

	"github.com/alexkalak/todos/backend-src/api/authorization/services"
	custom_erros "github.com/alexkalak/todos/backend-src/errors"
	"github.com/alexkalak/todos/backend-src/helpers/jwthelper"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

var authService = services.New()

func AuthController(router fiber.Router) {
	router.Use(cors.New(cors.Config{
		AllowOrigins: "*",
	}))

	router.Post("/registration", registrationHandler)

	router.Options("/registration", func(c *fiber.Ctx) error {
		c.Set("Access-Control-Allow-Origin", "http://localhost:3000")
		return c.SendString("heeeeeeeelp")
	})

	router.Get("/authorization", func(c *fiber.Ctx) error {
		return c.SendString("123")
	})
}

func registrationHandler(c *fiber.Ctx) error {
	user, validationErrors, err := authService.RegistrateUser(c)
	fmt.Println(user)
	fmt.Println(validationErrors)
	fmt.Println(err)
	if err != nil {
		switch {
		case errors.Is(err, custom_erros.ErrUserAlreadyExists):
			return c.JSON(fiber.Map{
				"ok":  false,
				"msg": err.Error(),
			})
		}
		return c.JSON(fiber.Map{
			"ok":  false,
			"msg": "Internal server error",
		})
	}

	if len(validationErrors) > 0 {
		c.SendStatus(http.StatusBadRequest)
		return c.JSON(fiber.Map{
			"ok":               false,
			"validationErrors": validationErrors,
		})
	}

	tokenStringAuth, tokenStringRefresh, err := jwthelper.CreateToken(int(user.Id), user.Username, user.Role)
	if err != nil {
		c.SendStatus(http.StatusInternalServerError)
		return c.JSON(fiber.Map{
			"ok":  false,
			"msg": "Internal server error",
		})
	}

	AuthCookie := fiber.Cookie{
		Name: "Auth", Value: *tokenStringAuth, HTTPOnly: true,
	}
	RefreshCookie := fiber.Cookie{
		Name: "Refresh", Value: *tokenStringRefresh, HTTPOnly: true,
	}

	c.Cookie(&AuthCookie)
	c.Cookie(&RefreshCookie)

	// c.Set("Access-Control-Allow-Origin", "http://localhost:9999")

	return c.JSON(fiber.Map{
		"ok":   true,
		"user": user,
	})
}
