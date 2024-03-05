package handlers

import (
	"api-quiz-app/api/db"
	"api-quiz-app/api/models"
	"api-quiz-app/utils"
	"encoding/json"
	"fmt"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
)

func Auth(c *gin.Context) {
	tokenString := c.GetHeader("Authorization")
	fmt.Println(tokenString)
	token, err := jwt.ParseWithClaims(tokenString, &jwt.StandardClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte("secret_key"), nil
	})
	if err != nil {
		c.JSON(401, gin.H{"error": "Token Error"})
		return
	}

	if claims, ok := token.Claims.(*jwt.StandardClaims); ok && token.Valid {
		expTime := time.Unix(claims.ExpiresAt, 0)
		if expTime.Before(time.Now()) {
			c.JSON(401, gin.H{"error": "Token Expired"})
			return
		}
		db, err := db.ConnectDB()
		if err != nil {
			c.JSON(401, gin.H{"error": "Failed to conncect database"})
			return
		}

		var user models.User
		if claims.Issuer != "admin" {
			c.JSON(401, gin.H{"error": "Token Unautorized"})
			return
		}

		if err := db.Where("email = ? AND role = ?", claims.Subject, claims.Issuer).First(&user).Error; err != nil {
			c.JSON(401, gin.H{"error": "Token Unautorized"})
			return
		}

		c.JSON(200, gin.H{"message": "success"})
	}

	c.JSON(401, gin.H{"error": "Token Unautorized"})
}

func LoginAdmin(c *gin.Context) {
	body, err := c.GetRawData()
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to read request body"})
		return
	}
	var data struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	err = json.Unmarshal(body, &data)
	if err != nil {
		c.JSON(400, gin.H{"error": "Invalid JSON format"})
		return
	}
	fmt.Println(string(body))

	db, err := db.ConnectDB()
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to connect to database"})
		return
	}

	var user models.User
	if err := db.Where("email = ? AND role = ?", data.Email, "admin").First(&user).Error; err != nil {
		c.JSON(401, gin.H{"error": "Invalid email"})
		return
	}

	if !utils.CheckPasswordHash(data.Password, user.Password) {
		c.JSON(401, gin.H{"error": "Invalid Password"})
		return
	}

	authenticatedUser := utils.User{
		Email:    user.Email,
		Password: user.Password,
		Nama:     user.Nama,
		Role:     user.Role,
	}

	secretKey := "secret_key"
	token, err := utils.GenerateJWTToken(authenticatedUser, secretKey)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to generate token"})
		return
	}

	c.JSON(200, gin.H{"token": token, "ID": user.ID})
}

func LoginUser(c *gin.Context) {
	body, err := c.GetRawData()
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to read request body"})
		return
	}
	var data struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	err = json.Unmarshal(body, &data)
	if err != nil {
		c.JSON(400, gin.H{"error": "Invalid JSON format"})
		return
	}

	db, err := db.ConnectDB()
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to connect to database"})
		return
	}

	var user models.User
	if err := db.Where("email = ? AND role = ?", data.Email, "user").First(&user).Error; err != nil {
		c.JSON(401, gin.H{"error": "Invalid email"})
		return
	}

	if !utils.CheckPasswordHash(data.Password, user.Password) {
		c.JSON(401, gin.H{"error": "Invalid Password"})
		return
	}

	authenticatedUser := utils.User{
		Email:    user.Email,
		Password: user.Password,
		Nama:     user.Nama,
		Role:     user.Role,
	}

	secretKey := "secret_key"
	token, err := utils.GenerateJWTToken(authenticatedUser, secretKey)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to generate token"})
		return
	}

	c.JSON(200, gin.H{"token": token, "ID": user.ID})
}

func GetUsers(c *gin.Context) {
	db, err := db.ConnectDB()
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to connect to database"})
		return
	}

	var users []models.User
	if err := db.Find(&users).Error; err != nil {
		c.JSON(500, gin.H{"error": "Failed to retrieve users"})
		return
	}

	c.JSON(200, users)
}

func GetUserByID(c *gin.Context) {
	userID := c.Param("id")

	db, err := db.ConnectDB()
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to connect to database"})
		return
	}

	var user models.User
	if err := db.First(&user, userID).Error; err != nil {
		c.JSON(404, gin.H{"error": "User not found"})
		return
	}

	c.JSON(200, user)
}

func CreateUser(c *gin.Context) {
	var user models.User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	hashedPassword, err := utils.HashPassword(user.Password)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to hash password"})
		return
	}
	user.Password = hashedPassword

	db, err := db.ConnectDB()
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to connect to database"})
		return
	}

	if err := db.Create(&user).Error; err != nil {
		c.JSON(500, gin.H{"error": "Failed to create user",
			"detail": err.Error()})
		return
	}

	c.JSON(201, user)
}

func UpdateUser(c *gin.Context) {
	userID := c.Param("id")

	var updatedUser models.User
	if err := c.ShouldBindJSON(&updatedUser); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	db, err := db.ConnectDB()
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to connect to database"})
		return
	}

	var user models.User
	if err := db.First(&user, userID).Error; err != nil {
		c.JSON(404, gin.H{"error": "User not found"})
		return
	}

	user.Nama = updatedUser.Nama
	user.Email = updatedUser.Email
	user.Password = updatedUser.Password
	user.Role = updatedUser.Role

	if err := db.Save(&user).Error; err != nil {
		c.JSON(500, gin.H{
			"error":  "Failed to update user",
			"detail": err.Error()})
		return
	}

	c.JSON(200, user)
}

func DeleteUser(c *gin.Context) {
	userID := c.Param("id")

	db, err := db.ConnectDB()
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to connect to database"})
		return
	}

	if err := db.Delete(&models.User{}, userID).Error; err != nil {
		c.JSON(500, gin.H{"error": "Failed to delete user"})
		return
	}

	c.JSON(204, nil)
}
