package models

import "gorm.io/gorm"

type UserAttempt struct {
	gorm.Model
	IDUser int `gorm:"not null"`
	IDQuiz int `gorm:"not null"`
	Skor   int
}
