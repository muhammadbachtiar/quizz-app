package routes

import (
	"api-quiz-app/api/handlers"

	"github.com/gin-gonic/gin"
)

func SetupLoginUsersRoutes(router *gin.Engine) {
	router.POST("/loginAdmin", handlers.LoginAdmin)
	router.POST("/loginUser", handlers.LoginUser)
	router.GET("/auth", handlers.Auth)
}
