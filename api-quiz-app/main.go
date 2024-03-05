package main

import (
	"api-quiz-app/api/db"
	"api-quiz-app/api/models"
	"api-quiz-app/api/routes"
	"fmt"

	"github.com/gin-gonic/gin"
)

func main() {
	db, err := db.ConnectDB()

	if err != nil {
		fmt.Println("Gagal terhubung ke database:", err)
		return
	}

	db.AutoMigrate(&models.User{})
	db.AutoMigrate(&models.Quiz{})
	db.AutoMigrate(&models.Pertanyaan{})
	db.AutoMigrate(&models.AnswerOption{})
	db.AutoMigrate(&models.UserAttempt{})
	db.AutoMigrate(&models.UserAnswer{})

	router := gin.Default()
	router.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(200)
			return
		}

		c.Next()
	})
	routes.SetupLoginUsersRoutes(router)
	routes.SetupUserRoutes(router)
	routes.SetupQuizRoutes(router)
	routes.SetupPertanyaanHandler(router)
	routes.SetupAnswerOption(router)
	routes.SetupUserAttemptRoutes(router)
	routes.SetupUserAnswerRoutes(router)
	router.Run(":8080")
}
