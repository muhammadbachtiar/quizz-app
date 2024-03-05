package routes

import (
	"api-quiz-app/api/handlers"
	"api-quiz-app/middleware"

	"github.com/gin-gonic/gin"
)

func SetupUserRoutes(router *gin.Engine) {
	userRoutes := router.Group("/users")
	{
		userRoutes.POST("/", handlers.CreateUser)
		userRoutes.GET("/", middleware.AuthAdminMiddleware(), handlers.GetUsers)
		userRoutes.GET("/:id", middleware.AuthAdminMiddleware(), handlers.GetUserByID)
		userRoutes.PUT("/:id", middleware.AuthAdminMiddleware(), handlers.UpdateUser)
		userRoutes.DELETE("/:id", middleware.AuthAdminMiddleware(), handlers.DeleteUser)
	}
}
