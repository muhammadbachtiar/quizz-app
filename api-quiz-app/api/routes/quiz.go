package routes

import (
	"api-quiz-app/api/handlers"
	"api-quiz-app/middleware"

	"github.com/gin-gonic/gin"
)

func SetupQuizRoutes(router *gin.Engine) {
	userRoutes := router.Group("/quiz")
	{
		userRoutes.POST("/", middleware.AuthAdminMiddleware(), handlers.CreateQuiz)
		userRoutes.GET("/", middleware.AuthMiddleware(), handlers.GetQuizzes)
		userRoutes.GET("/:id", middleware.AuthMiddleware(), handlers.GetQuizByID)
		userRoutes.PUT("/:id", middleware.AuthAdminMiddleware(), handlers.UpdateQuiz)
		userRoutes.DELETE("/:id", middleware.AuthAdminMiddleware(), handlers.DeleteQuiz)
	}
}
