package handlers

import (
	"api-quiz-app/api/db"
	"api-quiz-app/api/models"

	"github.com/gin-gonic/gin"
)

func CreateQuiz(c *gin.Context) {
	var inputQuiz models.Quiz
	if err := c.ShouldBindJSON(&inputQuiz); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	if inputQuiz.WaktuMulai.After(inputQuiz.WaktuSelesai) {
		c.JSON(400, gin.H{"error": "Waktu mulai harus sebelum waktu selesai"})
		return
	}

	db, err := db.ConnectDB()
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to connect to database"})
		return
	}

	if err := db.Create(&inputQuiz).Error; err != nil {
		c.JSON(500, gin.H{"error": "Failed to create quiz",
			"detail": err.Error()})
		return
	}

	c.JSON(201, inputQuiz)
}

func UpdateQuiz(c *gin.Context) {
	quizID := c.Param("id")

	db, err := db.ConnectDB()
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to connect to database"})
		return
	}

	var existingQuiz models.Quiz
	if err := db.First(&existingQuiz, quizID).Error; err != nil {
		c.JSON(404, gin.H{"error": "Quiz not found"})
		return
	}

	var updatedQuiz models.Quiz
	if err := c.ShouldBindJSON(&updatedQuiz); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	if updatedQuiz.WaktuMulai.After(updatedQuiz.WaktuSelesai) {
		c.JSON(400, gin.H{"error": "Waktu mulai harus sebelum waktu selesai"})
		return
	}

	if err := db.Model(&existingQuiz).Updates(updatedQuiz).Error; err != nil {
		c.JSON(400, gin.H{"error": "Failed to update quiz"})
		return
	}

	c.JSON(200, existingQuiz)
}

func GetQuizzes(c *gin.Context) {
	db, err := db.ConnectDB()
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to connect to database"})
		return
	}

	var quizzes []models.Quiz
	if err := db.Find(&quizzes).Error; err != nil {
		c.JSON(400, gin.H{"error": "Failed to fetch quizzes"})
		return
	}

	c.JSON(200, quizzes)
}

func GetQuizByID(c *gin.Context) {
	quizID := c.Param("id")

	db, err := db.ConnectDB()
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to connect to database"})
		return
	}

	var quiz models.Quiz
	if err := db.First(&quiz, quizID).Error; err != nil {
		c.JSON(400, gin.H{"error": "Quiz not found"})
		return
	}

	c.JSON(200, quiz)
}

func DeleteQuiz(c *gin.Context) {
	quizID := c.Param("id")

	db, err := db.ConnectDB()
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to connect to database"})
		return
	}

	var quiz models.Quiz
	if err := db.First(&quiz, quizID).Error; err != nil {
		c.JSON(400, gin.H{"error": "Quiz not found"})
		return
	}

	if err := db.Delete(&quiz).Error; err != nil {
		c.JSON(400, gin.H{"error": "Failed to delete quiz"})
		return
	}

	c.JSON(200, gin.H{"message": "Quiz deleted successfully"})
}
