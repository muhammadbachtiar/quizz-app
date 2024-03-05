package routes

import (
	"api-quiz-app/api/handlers"
	"api-quiz-app/middleware"

	"github.com/gin-gonic/gin"
)

func SetupUserAnswerRoutes(router *gin.Engine) {
	userRoutes := router.Group("/userAnswer")
	{
		userRoutes.POST("/", middleware.AuthAdminMiddleware(), handlers.CreateUserAnswer)
		userRoutes.GET("/:idPercobaan", middleware.AuthMiddleware(), handlers.GetAllUserAnswer)
	}
}
