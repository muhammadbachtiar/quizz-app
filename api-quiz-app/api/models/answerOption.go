package models

import "gorm.io/gorm"

type AnswerOption struct {
	gorm.Model
	PertanyaanID int    `gorm:"not null"`
	Jawaban      string `gorm:"not null"`
	Benar        bool   `gorm:"not null"`
}
