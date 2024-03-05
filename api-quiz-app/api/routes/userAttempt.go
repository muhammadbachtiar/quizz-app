package routes

import (
	"api-quiz-app/api/handlers"
	"api-quiz-app/middleware"

	"github.com/gin-gonic/gin"
)

func SetupUserAttemptRoutes(router *gin.Engine) {
	userRoutes := router.Group("/userattempts")
	userRoutes.Use(middleware.AuthMiddleware())
	{
		userRoutes.POST("/", handlers.CreateAttempt)
		userRoutes.GET("/", handlers.GetAllAttempts)
		userRoutes.PUT("/:id", handlers.UpdateAttempt)
		userRoutes.GET("/:id", handlers.GetAttemptByID)
	}
}
