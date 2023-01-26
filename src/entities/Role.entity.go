package entities

type Role struct {
	Id   int    `json:"-"`
	Name string `json:"name"`
}
