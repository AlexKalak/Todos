package services

import "github.com/alexkalak/todos/db"

func UserExistsInDB(email string) (bool, error) {
	conn, err := db.GetConnection()
	if err != nil {
		return false, err
	}

	query, err := conn.Prepare("SELECT * FROM users WHERE email = ?")
	if err != nil {
		return false, err
	}

	rows, err := query.Query(email)
	if err != nil {
		return false, err
	}
	if rows.Next() {
		return true, nil
	}

	return false, nil
}
