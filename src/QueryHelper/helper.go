package QueryHelper

import (
	"fmt"

	"github.com/alexkalak/todos/db"
)

func GetUserRole(roleId int) (*string, error) {
	conn, err := db.GetConnection()
	if err != nil {
		return nil, err
	}

	query, err := conn.Prepare("Select * from roles Where id = ?")
	if err != nil {
		return nil, err
	}

	var role struct {
		Id   int
		Name string
	}
	query.QueryRow(roleId).Scan(&role.Id, &role.Name)

	if role.Name == "" {
		return nil, fmt.Errorf("No role found")
	}

	return &role.Name, nil
}
