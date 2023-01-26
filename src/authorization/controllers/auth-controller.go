package controllers

import (
	"errors"
	"net/http"

	"github.com/alexkalak/todos/src/authorization/services"
	custom_erros "github.com/alexkalak/todos/src/errors"
	"github.com/alexkalak/todos/src/jwtHelper/jwtHelper"
	"github.com/gofiber/fiber/v2"
)

var authService = services.New()

func AuthController(router fiber.Router) {
	router.Post("/registration", registrationHandler)
	// router.Get("")
}

func registrationHandler(c *fiber.Ctx) error {
	user, validationErrors, err := authService.RegistrateUser(c)
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

	tokenStringAuth, tokenStringRefresh, err := jwtHelper.CreateToken(int(user.Id), user.Username, user.Role)
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

	return c.Redirect("/auth")
}
