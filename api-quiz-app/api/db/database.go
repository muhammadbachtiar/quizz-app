package db

import (
	"fmt"
	"os"

	"github.com/joho/godotenv"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

func ConnectDB() (*gorm.DB, error) {
	err := godotenv.Load(".env")
	if err != nil {
		fmt.Println("Error loading .env file")
	}

	dbUser := os.Getenv("MYSQL_USER")
	dbPassword := os.Getenv("MYSQL_PASSWORD")
	dbName := os.Getenv("MYSQL_DATABASE")
	dbPort := os.Getenv("MYSQL_PORT")

	dsn := fmt.Sprintf("%s:%s@tcp(127.0.0.1:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local", dbUser, dbPassword, dbPort, dbName)
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		return nil, err
	}
	return db, nil
}
