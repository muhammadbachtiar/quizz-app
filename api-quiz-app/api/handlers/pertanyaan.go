package handlers

import (
	"api-quiz-app/api/db"
	"api-quiz-app/api/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type Pertanyaan struct {
	gorm.Model
	IDQuiz       uint
	Pertanyaan   string
	AnswerOption []models.AnswerOption `gorm:"foreignKey:PertanyaanID"`
}

func CreatePertanyaan(c *gin.Context) {

	db, err := db.ConnectDB()
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to connect to database"})
		return
	}

	var pertanyaan models.Pertanyaan
	if err := c.ShouldBindJSON(&pertanyaan); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	if err := db.Create(&pertanyaan).Error; err != nil {
		c.JSON(500, gin.H{"error": "Failed to create pertanyaan"})
		return
	}

	c.JSON(201, pertanyaan)
}

func GetPertanyaanByID(c *gin.Context) {
	db, err := db.ConnectDB()
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to connect to database"})
		return
	}

	pertanyaanID := c.Param("id")
	var pertanyaan models.Pertanyaan

	if err := db.First(&pertanyaan, pertanyaanID).Error; err != nil {
		c.JSON(400, gin.H{"error": "Quiz not found"})
		return
	}

	c.JSON(200, pertanyaan)
}

func GetPertanyaan(c *gin.Context) {
	db, err := db.ConnectDB()
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to connect to database"})
		return
	}

	idQuiz := c.Param("idQuiz")
	var pertanyaans []Pertanyaan

	if err := db.Preload("AnswerOption").Where("id_quiz = ?", idQuiz).Find(&pertanyaans).Error; err != nil {
		c.JSON(400, gin.H{"error": "Pertanyaan not found"})
		return
	}

	c.JSON(200, pertanyaans)
}

func UpdatePertanyaan(c *gin.Context) {
	db, err := db.ConnectDB()
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to connect to database"})
		return
	}

	pertanyaanID := c.Param("id")

	var existingPertanyaan models.Quiz
	if err := db.First(&existingPertanyaan, pertanyaanID).Error; err != nil {
		c.JSON(404, gin.H{"error": "Quiz not found"})
		return
	}

	var pertanyaan models.Quiz
	if err := c.ShouldBindJSON(&pertanyaan); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	if err := db.Model(&existingPertanyaan).Updates(pertanyaan).Error; err != nil {
		c.JSON(400, gin.H{"error": "Failed to update pertanyaan"})
		return
	}

	c.JSON(200, pertanyaan)
}

func DeletePertanyaanByID(c *gin.Context) {
	db, err := db.ConnectDB()
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to connect to database"})
		return
	}

	pertanyaanID := c.Param("id")
	var pertanyaan models.Pertanyaan

	if err := db.First(&pertanyaan, pertanyaanID).Error; err != nil {
		c.JSON(400, gin.H{"error": "Pertanyaan not found"})
		return
	}

	if err := db.Delete(&pertanyaan).Error; err != nil {
		c.JSON(400, gin.H{"error": "Failed to delete pertanyaan"})
		return
	}

	c.JSON(204, nil)
}
