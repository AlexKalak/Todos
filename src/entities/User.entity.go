package entities

import (
	"github.com/alexkalak/todos/src/QueryHelper"
)

type User struct {
	Id       int64  `json:"-"`
	Username string `json:"username" validate:"required,min=4"`
	Password string `json:"password" validate:"required,min=8"`
	Email    string `json:"email" validate:"required,email"`
	RoleID   int    `json:"-"`
}

func (u *User) Serialize() (*SerializedUser, error) {
	p_role, err := QueryHelper.GetUserRole(u.RoleID)
	if err != nil {
		return nil, err
	}

	return &SerializedUser{
		Id:       u.Id,
		Username: u.Username,
		Email:    u.Email,
		Role:     *p_role,
	}, nil
}

type SerializedUser struct {
	Id       int64  `json:"id"`
	Username string `json:"username"`
	Email    string `json:"email"`
	Role     string `json:"role"`
}
