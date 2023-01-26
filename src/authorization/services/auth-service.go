package services

import (
	"fmt"

	"github.com/alexkalak/todos/db"
	"github.com/alexkalak/todos/src/authorization/validation"
	"github.com/alexkalak/todos/src/entities"
	"github.com/alexkalak/todos/src/errors"
	globalerrors "github.com/alexkalak/todos/src/errors"
	"github.com/alexkalak/todos/src/types"
	"github.com/gofiber/fiber/v2"
)

type AuthService interface {
	RegistrateUser(c *fiber.Ctx) (*entities.SerializedUser, []*types.ErrorResponse, error)
}

type authService struct {
}

func New() AuthService {
	return &authService{}
}

func (a *authService) RegistrateUser(c *fiber.Ctx) (*entities.SerializedUser, []*types.ErrorResponse, error) {
	conn, err := db.GetConnection()
	if err != nil {
		return nil, nil, err
	}

	var user entities.User
	user.RoleID = 1

	err = c.BodyParser(&user)
	if err != nil {
		return nil, nil, fmt.Errorf("Some error occured")
	}

	validationErrors := validation.Validate(&user)
	if len(validationErrors) > 0 {
		return nil, validationErrors, nil
	}

	userExists, err := UserExistsInDB(user.Email)
	if userExists {
		return nil, nil, errors.ErrUserAlreadyExists
	}

	insertQuery, err := conn.Prepare(`INSERT INTO users (username, password, email, role_id) VALUES (?, ?, ?, ?);`)
	if err != nil {
		fmt.Println(err)
		return nil, nil, globalerrors.ErrInternalServerError
	}

	res, err := insertQuery.Exec(user.Username, user.Password, user.Email, user.RoleID)
	if err != nil {
		fmt.Println("err")
		fmt.Println(err)
		return nil, nil, err
	}
	rowsAffected, _ := res.RowsAffected()
	if rowsAffected < 1 {
		return nil, nil, globalerrors.ErrInternalServerError
	}

	id, err := res.LastInsertId()
	if err != nil {
		return nil, nil, err
	}

	user.Id = id
	serializedUser, err := user.Serialize()
	if err != nil {
		return nil, nil, err
	}
	return serializedUser, nil, nil
}
