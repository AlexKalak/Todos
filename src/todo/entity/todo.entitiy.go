package entity

import "time"

type Todo struct {
	Id          int       `json:"id"`
	Title       string    `json:"title" validate:"required,min=3,max=50"`
	Task        string    `json:"task" validate:"required,min=3,max=1500"`
	CreatedTime time.Time `json:"createdtime"`
	AuthorName  string    `json:"author" validate:"required,min=3,max=50"`
}

var SerializedTodoTimeFormat = "2006/01/02 15:04:05"

type SerializedTodo struct {
	Id          int    `json:"id"`
	Title       string `json:"title" validate:"required,min=3,max=30"`
	Task        string `json:"task" validate:"required,min=3,max=45"`
	CreatedTime string `json:"createdtime"`
	AuthorName  string `json:"author" validate:"required,min=3,max=45"`
}
