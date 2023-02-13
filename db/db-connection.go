package db

import (
	"database/sql"
	"fmt"
	"sync"

	_ "github.com/go-sql-driver/mysql"
)

var DB *sql.DB
var lock sync.Mutex

func GetConnection() (*sql.DB, error) {
	fmt.Println("Getting connection")
	if DB == nil {
		lock.Lock()
		defer lock.Unlock()
		if DB == nil {
			var err error
			fmt.Println("Create connection")
			DB, err = sql.Open("mysql", "root:rootroot@tcp(localhost:3306)/todos")
			if err != nil {
				return nil, err
			}
			return DB, nil
		}
		return DB, nil
	}
	return DB, nil
}
