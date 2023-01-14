package services

import (
	"fmt"
	"strconv"
	"time"

	"github.com/alexkalak/todos/db"
	globalerrors "github.com/alexkalak/todos/src/errors"
	"github.com/alexkalak/todos/src/todo/entity"
	todoerrors "github.com/alexkalak/todos/src/todo/errors"
	"github.com/alexkalak/todos/src/types"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
)

type TodoService interface {
	GetAllTodos() *[]entity.SerializedTodo
	SaveTodo(c *fiber.Ctx) (*entity.SerializedTodo, []*types.ErrorResponse, error)
	GetTodoById(c *fiber.Ctx) (*entity.SerializedTodo, error)
	DeleteTodoById(c *fiber.Ctx) (bool, error)
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
		fmt.Println(string(tm))
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

	errors := ValidateTodo(todo)
	if len(errors) > 0 {
		return nil, errors, nil
	}

	todo.CreatedTime = time.Now()

	query := fmt.Sprintf(`INSERT INTO todos (title, task, created_time, author_name) OUTPUT Inserted.Col1, Inserted.IDCol, Inserted.Col17 VALUES ("%s", "%s", "%s", "%s")`,
		todo.Title, todo.Task, todo.CreatedTime.Format("2006-01-02 15:04:05"), todo.AuthorName)

	res, err := conn.Query(query)
	defer res.Close()
	if err != nil {
		fmt.Println("err")
		fmt.Println(err)
		return nil, nil, err
	}

	serializedTodo := entity.SerializedTodo{
		Id:          todo.Id,
		Title:       todo.Title,
		Task:        todo.Task,
		AuthorName:  todo.AuthorName,
		CreatedTime: todo.CreatedTime.Format(entity.SerializedTodoTimeFormat),
	}
	return &serializedTodo, nil, nil
}

var validate = validator.New()

func ValidateTodo(todo entity.Todo) []*types.ErrorResponse {
	var errors []*types.ErrorResponse

	err := validate.Struct(todo)
	if err != nil {
		for _, err := range err.(validator.ValidationErrors) {
			var element types.ErrorResponse
			element.FailedField = err.StructNamespace()
			element.Tag = err.Tag()
			element.Value = err.Param()
			errors = append(errors, &element)
		}
	}
	return errors
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
	defer res.Close()
	if err != nil {
		return nil, globalerrors.ErrInternalServerError
	}

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
