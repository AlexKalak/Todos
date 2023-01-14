package errors

import "errors"

var ErrUserNotFound = errors.New("user not found")
var ErrParseError = errors.New("user input parse error")
