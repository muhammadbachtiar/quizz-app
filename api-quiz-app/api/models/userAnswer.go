package models

import "gorm.io/gorm"

type UserAnswer struct {
	gorm.Model
	IDPercobaan  int `gorm:"not null"`
	IDPertanyaan int `gorm:"not null"`
	IDJawaban    int `gorm:"not null"`
}
