package handlers

import (
	"api-quiz-app/api/db"
	"api-quiz-app/api/models"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type UserAnswer struct {
	gorm.Model
	IDPercobaan  int                 `gorm:"not null"`
	IDPertanyaan int                 `gorm:"not null"`
	IDJawaban    int                 `gorm:"not null"`
	Pertanyaan   models.Pertanyaan   `gorm:"foreignKey:IDPertanyaan"`
	Jawaban      models.AnswerOption `gorm:"foreignKey:IDJawaban"`
}

func CreateUserAnswer(c *gin.Context) {
	var userAnswer models.UserAnswer

	db, err := db.ConnectDB()
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to connect to database"})
		return
	}

	if err := c.ShouldBindJSON(&userAnswer); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := db.Create(&userAnswer).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user answer"})
		return
	}

	c.JSON(http.StatusCreated, userAnswer)
}

func GetAllUserAnswer(c *gin.Context) {
	percobaanID := c.Param("idPercobaan")
	var userAnswers []UserAnswer

	db, err := db.ConnectDB()
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to connect to database"})
		return
	}

	if err := db.Preload("Pertanyaan").Preload("Jawaban").Where("id_percobaan = ?", percobaanID).Find(&userAnswers).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch user answers"})
		return
	}

	c.JSON(http.StatusOK, userAnswers)
}
