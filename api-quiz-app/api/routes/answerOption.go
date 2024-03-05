package routes

import (
	"api-quiz-app/api/handlers"
	"api-quiz-app/middleware"

	"github.com/gin-gonic/gin"
)

func SetupAnswerOption(router *gin.Engine) {
	userRoutes := router.Group("/answerOption")
	{
		userRoutes.POST("/", middleware.AuthAdminMiddleware(), handlers.CreateAnswerOption)
		userRoutes.GET("/pertanyaan/:idPertanyaan", middleware.AuthMiddleware(), handlers.GetAnswerOptionsByIDPertanyaan)
		userRoutes.PUT("/:id", middleware.AuthAdminMiddleware(), handlers.UpdateAnswerOption)
		userRoutes.DELETE("/:id", middleware.AuthAdminMiddleware(), handlers.DeleteAnswerOption)
	}
}
