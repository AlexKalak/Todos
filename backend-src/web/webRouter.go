package web

import "github.com/gofiber/fiber/v2"

func WebRouter(router fiber.Router) {
	router.Get("/", func(c *fiber.Ctx) error {
		return c.Render("build/index.html", fiber.Map{})
	})
}
