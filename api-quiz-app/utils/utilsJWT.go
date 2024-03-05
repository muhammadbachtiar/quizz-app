package utils

import (
	"time"

	"github.com/dgrijalva/jwt-go"
)

type Login struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type User struct {
	Email    string `json:"email"`
	Password string `json:"password"`
	Role     string `json:"role"`
	Nama     string `json:"nama"`
}

func GenerateJWTToken(user User, secretKey string) (string, error) {
	claims := jwt.StandardClaims{
		Subject:   user.Email,
		Issuer:    user.Role,
		ExpiresAt: time.Now().Add(time.Hour * 24).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	signedToken, err := token.SignedString([]byte(secretKey))
	if err != nil {
		return "", err
	}

	return signedToken, nil
}
