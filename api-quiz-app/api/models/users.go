package models

import (
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Nama     string `gorm:"not null"`
	Email    string `gorm:"not null;unique"`
	Password string `gorm:"not null"`
	Role     string `gorm:"not null"`
}
