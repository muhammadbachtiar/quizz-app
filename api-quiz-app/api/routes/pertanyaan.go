package routes

import (
	"api-quiz-app/api/handlers"
	"api-quiz-app/middleware"

	"github.com/gin-gonic/gin"
)

func SetupPertanyaanHandler(router *gin.Engine) {
	userRoutes := router.Group("/pertanyaan")
	{
		userRoutes.POST("/", middleware.AuthAdminMiddleware(), handlers.CreatePertanyaan)
		userRoutes.GET("/quiz/:idQuiz", middleware.AuthMiddleware(), handlers.GetPertanyaan)
		userRoutes.GET("/:id", middleware.AuthMiddleware(), handlers.GetPertanyaanByID)
		userRoutes.PUT("/:id", middleware.AuthAdminMiddleware(), handlers.UpdatePertanyaan)
		userRoutes.DELETE("/:id", middleware.AuthAdminMiddleware(), handlers.DeletePertanyaanByID)
	}
}
