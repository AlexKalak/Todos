package validation

import (
	"github.com/alexkalak/todos/backend-src/types"
	"github.com/go-playground/validator/v10"
)

var validation *validator.Validate

func GetValidation() *validator.Validate {
	if validation != nil {
		return validation
	}
	validation = validator.New()
	return validation
}

func Validate(structure interface{}) []*types.ErrorResponse {
	var errors []*types.ErrorResponse

	err := GetValidation().Struct(structure)
	if err != nil {
		for _, err := range err.(validator.ValidationErrors) {
			var element types.ErrorResponse
			element.FailedField = err.Field()
			element.Tag = err.Tag()
			element.Value = err.Param()
			errors = append(errors, &element)
		}
	}
	return errors
}
