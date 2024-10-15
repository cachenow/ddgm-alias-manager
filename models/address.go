package models

import (
	"gorm.io/gorm"
)

type Address struct {
	gorm.Model
	UserID           uint
	GeneratedAddress string
	RealAddress      string
	ConvertedAddress string // 添加这个字段
	TokenValue       string
	TokenDescription string
}
