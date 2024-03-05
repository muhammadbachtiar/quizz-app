package handlers

import (
	"api-quiz-app/api/db"
	"api-quiz-app/api/models"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type UserAttempt struct {
	gorm.Model
	IDUser int         `gorm:"not null"`
	User   models.User `gorm:"foreignKey:IDUser"`
	IDQuiz int         `gorm:"not null"`
	Quiz   models.Quiz `gorm:"foreignKey:IDQuiz"`
	Skor   int
}

func CreateAttempt(c *gin.Context) {
	var attempt models.UserAttempt

	db, err := db.ConnectDB()
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to connect to database"})
		return
	}

	if err := c.ShouldBindJSON(&attempt); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := db.Create(&attempt).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create attempt"})
		return
	}

	c.JSON(http.StatusCreated, attempt)
}

func GetAllAttempts(c *gin.Context) {
	var attempts []UserAttempt

	db, err := db.ConnectDB()
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to connect to database"})
		return
	}

	if err := db.Preload("User").Preload("Quiz").Find(&attempts).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch attempts"})
		return
	}

	c.JSON(http.StatusOK, attempts)
}

func GetAttemptByID(c *gin.Context) {
	attemptID := c.Param("id")
	var attempt UserAttempt

	db, err := db.ConnectDB()
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to connect to database"})
		return
	}

	if err := db.Preload("User").Preload("Quiz").First(&attempt, attemptID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Attempt not found"})
		return
	}

	c.JSON(http.StatusOK, attempt)
}

func UpdateAttempt(c *gin.Context) {
	attemptID := c.Param("id")
	var attempt models.UserAttempt

	db, err := db.ConnectDB()
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to connect to database"})
		return
	}

	if err := db.First(&attempt, attemptID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Attempt not found"})
		return
	}

	if err := c.ShouldBindJSON(&attempt); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := db.Save(&attempt).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update attempt"})
		return
	}

	c.JSON(http.StatusOK, attempt)
}
