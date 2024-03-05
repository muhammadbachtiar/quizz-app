package middleware

import (
	"api-quiz-app/api/models"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

func IsAdmin() gin.HandlerFunc {
	return func(c *gin.Context) {
		user, exists := c.Get("user")
		fmt.Println(user)
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "User data not found"})
			c.Abort()
			return
		}

		userRole, ok := user.(models.User)
		if !ok {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unable to retrieve user role"})
			c.Abort()
			return
		}

		if userRole.Role == "admin" {
			c.Next()
		} else {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "User is not an admin"})
			c.Abort()
		}
	}
}
