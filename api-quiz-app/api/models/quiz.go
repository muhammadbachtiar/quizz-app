package models

import (
	"time"

	"gorm.io/gorm"
)

type Quiz struct {
	gorm.Model
	Judul        string    `gorm:"not null"`
	Deskripsi    string    `gorm:"type:text"`
	WaktuMulai   time.Time `gorm:"not null"`
	WaktuSelesai time.Time `gorm:"not null"`
}
