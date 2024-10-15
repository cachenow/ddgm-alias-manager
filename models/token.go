package models

import (
	"gorm.io/gorm"
)

type Token struct {
	gorm.Model
	UserID      uint
	Value       string
	Description string
	IsDefault   bool
}
