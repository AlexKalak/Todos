package jwtHelper

import (
	"fmt"
	"time"

	"github.com/alexkalak/todos/src/jwtHelper/entity"
	"github.com/golang-jwt/jwt/v4"
)

func validateToken(token *jwt.Token) (interface{}, error) {
	_, ok := token.Method.(*jwt.SigningMethodHMAC)
	if !ok {
		return nil, fmt.Errorf("there was an error")
	}

	return []byte("MyKey"), nil
}

func CreateToken(id int, username string, role string) (*string, *string, error) {
	claimsAuth := entity.Claims{
		UserId:   id,
		Username: username,
		Role:     role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour * 30)),
		},
	}

	claimsRefresh := entity.Claims{
		UserId:   id,
		Username: username,
		Role:     role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour * 24 * 30)),
		},
	}

	tokenStringAuth, err := jwt.NewWithClaims(jwt.SigningMethodHS256, claimsAuth).SignedString([]byte("MyKey"))
	if err != nil {
		return nil, nil, fmt.Errorf("some error occured")
	}

	tokenStringRefresh, err := jwt.NewWithClaims(jwt.SigningMethodHS256, claimsRefresh).SignedString([]byte("MyKey"))
	if err != nil {
		return nil, nil, fmt.Errorf("some error occured")
	}

	return &tokenStringAuth, &tokenStringRefresh, nil
}

func ParseToken(tokenString string) (*jwt.Token, error) {
	token, err := jwt.Parse(tokenString, validateToken)
	if err != nil {
		fmt.Println(err.Error())
		return nil, err
	}
	// fmt.Println(token.Valid)
	return token, nil
}
