package authorization

import (
	"fmt"
	"net/http"

	"github.com/alexkalak/todos/src/jwtHelper/jwtHelper"
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v4"
)

func New(config fiber.Config) fiber.Handler {
	return func(c *fiber.Ctx) error {
		fmt.Println("In middleware")
		authTokenString := c.Cookies("Auth")
		refreshTokenString := c.Cookies("Refresh")

		authToken, err := jwtHelper.ParseToken(authTokenString)
		if err != nil {
			c.ClearCookie("Auth", "Refresh")
			return c.Redirect("/auth/authorization")
		}

		if !authToken.Valid {
			refreshToken, err := jwtHelper.ParseToken(refreshTokenString)
			if err != nil {
				c.ClearCookie("Auth", "Refresh")
				return c.Redirect("/auth/authorization")
			}

			if !refreshToken.Valid {
				c.ClearCookie("Auth", "Refresh")
				return c.Redirect("/auth/authorization")
			}
			c.ClearCookie("Auth", "Refresh")
			return c.Redirect("/auth/refresh")
		}

		map_tokenClaims, ok := authToken.Claims.(jwt.MapClaims)
		if !ok {
			c.ClearCookie()
			return c.SendStatus(http.StatusInternalServerError)
		}
		role := map_tokenClaims["role"]
		id := map_tokenClaims["id"]
		username := map_tokenClaims["username"]

		c.Locals("authentificated", true)
		c.Locals("userId", id)
		c.Locals("role", role)
		c.Locals("username", username)

		c.Next()
		return nil
	}
}
