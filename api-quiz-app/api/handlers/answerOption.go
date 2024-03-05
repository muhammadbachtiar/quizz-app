package handlers

import (
	"api-quiz-app/api/db"
	"api-quiz-app/api/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func CreateAnswerOption(c *gin.Context) {
	var inputOption models.AnswerOption
	if err := c.ShouldBindJSON(&inputOption); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db, err := db.ConnectDB()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to connect to database"})
		return
	}

	if err := db.Create(&inputOption).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create answer option", "detail": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, inputOption)
}

func UpdateAnswerOption(c *gin.Context) {
	optionID := c.Param("id")

	db, err := db.ConnectDB()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to connect to database"})
		return
	}

	var existingOption models.AnswerOption
	if err := db.First(&existingOption, optionID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Answer option not found"})
		return
	}

	var updatedOption models.AnswerOption
	if err := c.ShouldBindJSON(&updatedOption); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := db.Model(&existingOption).Updates(updatedOption).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to update answer option"})
		return
	}

	c.JSON(http.StatusOK, existingOption)
}

func GetAnswerOptionsByIDPertanyaan(c *gin.Context) {
	PertanyaanID := c.Param("idPertanyaan")

	db, err := db.ConnectDB()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to connect to database"})
		return
	}

	var options []models.AnswerOption
	if err := db.Where("pertanyaan_id = ?", PertanyaanID).Find(&options).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to fetch answer options"})
		return
	}

	c.JSON(http.StatusOK, options)
}

func GetAnswerOptionByID(c *gin.Context) {
	optionID := c.Param("id")

	db, err := db.ConnectDB()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to connect to database"})
		return
	}

	var option models.AnswerOption
	if err := db.First(&option, optionID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Answer option not found"})
		return
	}

	c.JSON(http.StatusOK, option)
}

func DeleteAnswerOption(c *gin.Context) {
	optionID := c.Param("id")

	db, err := db.ConnectDB()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to connect to database"})
		return
	}

	var option models.AnswerOption
	if err := db.First(&option, optionID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Answer option not found"})
		return
	}

	if err := db.Delete(&option).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to delete answer option"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Answer option deleted successfully"})
}
