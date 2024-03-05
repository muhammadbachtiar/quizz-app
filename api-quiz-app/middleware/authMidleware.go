package middleware

import (
	"api-quiz-app/api/db"
	"api-quiz-app/api/models"
	"fmt"
	"net/http"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
)

func isValidTokenAdmin(tokenString string) (bool, *models.User, error) {
	token, err := jwt.ParseWithClaims(tokenString, &jwt.StandardClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte("secret_key"), nil
	})
	if err != nil {
		return false, nil, err
	}

	if claims, ok := token.Claims.(*jwt.StandardClaims); ok && token.Valid {
		expTime := time.Unix(claims.ExpiresAt, 0)
		if expTime.Before(time.Now()) {
			return false, nil, nil
		}
		db, err := db.ConnectDB()
		if err != nil {
			return false, nil, err
		}

		var user models.User
		if claims.Issuer != "admin" {
			return false, nil, nil
		}

		if err := db.Where("email = ? AND role = ?", claims.Subject, claims.Issuer).First(&user).Error; err != nil {
			return false, nil, err
		}

		return true, &user, nil
	}

	return false, nil, nil
}

func isValidToken(tokenString string) (bool, *models.User, error) {
	token, err := jwt.ParseWithClaims(tokenString, &jwt.StandardClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte("secret_key"), nil
	})
	if err != nil {
		return false, nil, err
	}

	if claims, ok := token.Claims.(*jwt.StandardClaims); ok && token.Valid {
		expTime := time.Unix(claims.ExpiresAt, 0)
		if expTime.Before(time.Now()) {
			return false, nil, nil
		}
		db, err := db.ConnectDB()
		if err != nil {
			return false, nil, err
		}

		var user models.User

		if err := db.Where("email = ? AND role = ?", claims.Subject, claims.Issuer).First(&user).Error; err != nil {
			return false, nil, err
		}

		return true, &user, nil
	}

	return false, nil, nil
}

func AuthAdminMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		token := c.GetHeader("Authorization")
		fmt.Println(token)

		isValid, user, err := isValidTokenAdmin(token)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal Server Error"})
			c.Abort()
			return
		}
		if isValid {
			c.Set("user", user)
			c.Next()
		} else {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token or token has expired"})
			c.Abort()
		}
	}
}

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		token := c.GetHeader("Authorization")
		fmt.Println(token)

		isValid, user, err := isValidToken(token)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal Server Error"})
			c.Abort()
			return
		}
		if isValid {
			c.Set("user", user)
			c.Next()
		} else {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token or token has expired"})
			c.Abort()
		}
	}
}
