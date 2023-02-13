package errors

import "errors"

var ErrConnectionError = errors.New("connection error")
var ErrInternalServerError = errors.New("internal server error")
var ErrBadRequestError = errors.New("bad request")

var ErrUserAlreadyExists = errors.New("user already exists")
