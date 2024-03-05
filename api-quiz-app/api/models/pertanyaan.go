package models

import "gorm.io/gorm"

type Pertanyaan struct {
	gorm.Model
	Pertanyaan string `gorm:"not null"`
	IDQuiz     int    `gorm:"not null"`
}
