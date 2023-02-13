package services

import (
	"fmt"
	"strconv"
	"time"

	"github.com/alexkalak/todos/backend-src/api/todo/entity"
	todoerrors "github.com/alexkalak/todos/backend-src/api/todo/errors"
	globalerrors "github.com/alexkalak/todos/backend-src/errors"
	"github.com/alexkalak/todos/backend-src/types"
	"github.com/alexkalak/todos/backend-src/validation"
	"github.com/alexkalak/todos/db"

	"github.com/gofiber/fiber/v2"
)

type TodoService interface {
	GetAllTodos() *[]entity.SerializedTodo
	SaveTodo(c *fiber.Ctx) (*entity.SerializedTodo, []*types.ErrorResponse, error)
	GetTodoById(c *fiber.Ctx) (*entity.SerializedTodo, error)
	DeleteTodoById(c *fiber.Ctx) (bool, error)
	UpdateTodo(c *fiber.Ctx) (*entity.SerializedTodo, []*types.ErrorResponse, error)
}

type todoService struct {
}

func New() TodoService {
	return &todoService{}
}

func (t *todoService) GetAllTodos() *[]entity.SerializedTodo {
	conn, err := db.GetConnection()
	if err != nil {
		fmt.Println(err.Error())
		return new([]entity.SerializedTodo)
	}

	res, err := conn.Query("SELECT * FROM todos")
	if err != nil {
		fmt.Println(err.Error())
		return new([]entity.SerializedTodo)
	}

	fmt.Println("Sended query to db")

	todoArr := make([]entity.SerializedTodo, 0, 5)
	for res.Next() {
		var tm []byte
		var todo entity.SerializedTodo

		res.Scan(&todo.Id, &todo.Title, &todo.Task, &tm, &todo.AuthorName)
		parsedTM, _ := time.Parse("2006-01-02 15:04:05", string(tm))
		todo.CreatedTime = parsedTM.Format(entity.SerializedTodoTimeFormat)

		todoArr = append(todoArr, todo)
	}
	return &todoArr
}

func (t *todoService) SaveTodo(c *fiber.Ctx) (*entity.SerializedTodo, []*types.ErrorResponse, error) {
	conn, err := db.GetConnection()
	if err != nil {
		return nil, nil, err
	}

	var todo entity.Todo
	c.BodyParser(&todo)

	errors := validation.Validate(todo)
	if len(errors) > 0 {
		return nil, errors, nil
	}

	todo.CreatedTime = time.Now()

	insertQuery, err := conn.Prepare(`INSERT INTO todos (title, task, created_time, author_name) VALUES (?, ?, ?, ?);`)
	if err != nil {
		fmt.Println("err")
		fmt.Println(err)
		return nil, nil, globalerrors.ErrInternalServerError
	}

	res, err := insertQuery.Exec(todo.Title, todo.Task, todo.CreatedTime.Format("2006-01-02 15:04:05"), todo.AuthorName)
	if err != nil {
		fmt.Println("err")
		fmt.Println(err)
		return nil, nil, err
	}
	lastInsId, err := res.LastInsertId()
	if err != nil {
		return nil, nil, globalerrors.ErrInternalServerError
	}

	serializedTodo := entity.SerializedTodo{
		Id:          int(lastInsId),
		Title:       todo.Title,
		Task:        todo.Task,
		AuthorName:  todo.AuthorName,
		CreatedTime: todo.CreatedTime.Format(entity.SerializedTodoTimeFormat),
	}
	return &serializedTodo, nil, nil
}

func (t *todoService) GetTodoById(c *fiber.Ctx) (*entity.SerializedTodo, error) {
	conn, err := db.GetConnection()
	if err != nil {
		return nil, globalerrors.ErrInternalServerError
	}

	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return nil, todoerrors.ErrParseError
	}

	query := fmt.Sprintf(`SELECT * FROM todos WHERE id = %d`, id)
	res, err := conn.Query(query)
	if err != nil {
		return nil, globalerrors.ErrInternalServerError
	}
	defer res.Close()

	if res.Next() {
		var tm []byte
		var todo entity.SerializedTodo

		res.Scan(&todo.Id, &todo.Title, &todo.Task, &tm, &todo.AuthorName)

		parsedTM, _ := time.Parse("2006-01-02 15:04:05", string(tm))
		todo.CreatedTime = parsedTM.Format(entity.SerializedTodoTimeFormat)

		if err != nil {
			return nil, globalerrors.ErrInternalServerError
		}

		return &todo, nil
	} else {
		return nil, todoerrors.ErrUserNotFound
	}
}

func (t *todoService) DeleteTodoById(c *fiber.Ctx) (bool, error) {
	conn, err := db.GetConnection()
	if err != nil {
		return false, globalerrors.ErrInternalServerError
	}

	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return false, todoerrors.ErrParseError
	}

	delQuery, err := conn.Prepare(`DELETE FROM todos WHERE (id = ?)`)
	if err != nil {
		return false, globalerrors.ErrInternalServerError
	}

	res, err := delQuery.Exec(id)
	if err != nil {
		return false, globalerrors.ErrInternalServerError
	}

	rowsAffected, err := res.RowsAffected()
	if err != nil {
		return false, globalerrors.ErrInternalServerError
	}

	if rowsAffected < 1 {
		return false, todoerrors.ErrUserNotFound
	}

	if err != nil {
		return false, globalerrors.ErrInternalServerError
	}

	return true, nil
}

func (t *todoService) UpdateTodo(c *fiber.Ctx) (*entity.SerializedTodo, []*types.ErrorResponse, error) {
	conn, err := db.GetConnection()
	if err != nil {
		return nil, nil, err
	}

	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return nil, nil, todoerrors.ErrParseError
	}

	var todo entity.Todo
	c.BodyParser(&todo)

	validationErrors := validation.Validate(todo)
	if len(validationErrors) > 0 {
		return nil, validationErrors, nil
	}

	todo.CreatedTime = time.Now()

	insertQuery, err := conn.Prepare(`UPDATE todos SET title = ?, task = ? , created_time = ? , author_name = ? WHERE id = ?;`)
	if err != nil {
		return nil, nil, globalerrors.ErrInternalServerError
	}

	res, err := insertQuery.Exec(
		todo.Title,
		todo.Task,
		todo.CreatedTime.Format("2006-01-02 15:04:05"),
		todo.AuthorName,
		id,
	)

	if err != nil {
		return nil, nil, globalerrors.ErrInternalServerError
	}

	rowsAff, err := res.RowsAffected()
	if err != nil {
		return nil, nil, globalerrors.ErrInternalServerError
	}
	if rowsAff < 1 {
		return nil, nil, globalerrors.ErrInternalServerError
	}
	fmt.Println(id)

	serializedTodo := entity.SerializedTodo{
		Id:          id,
		Title:       todo.Title,
		Task:        todo.Task,
		AuthorName:  todo.AuthorName,
		CreatedTime: todo.CreatedTime.Format(entity.SerializedTodoTimeFormat),
	}
	return &serializedTodo, nil, nil
}
