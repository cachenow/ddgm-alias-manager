package models

import (
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Username           string `gorm:"unique"`
	PasswordHash       string
	IsAdmin            bool
	Token              string
	NeedsPasswordReset bool
}
