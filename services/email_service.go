package services

import (
	"anonymail/models"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"strings"

	"gorm.io/gorm"
)

func GenerateEmailAddress(db *gorm.DB, userID uint, realAddress string, tokenValue string, tokenDescription string) (string, error) {
	// 使用DuckDuckGo API生成邮箱地址
	url := "https://quack.duckduckgo.com/api/email/addresses"
	payload := strings.NewReader(`{}`)
	req, err := http.NewRequest("POST", url, payload)
	if err != nil {
		return "", err
	}

	req.Header.Add("Authorization", "Bearer "+tokenValue)
	req.Header.Add("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}

	var result struct {
		Address string `json:"address"`
	}
	if err := json.Unmarshal(body, &result); err != nil {
		return "", err
	}

	if result.Address == "" {
		return "", fmt.Errorf("failed to generate address: %s", string(body))
	}

	// 转换实际地址
	convertedAddress := convertRealAddress(realAddress, result.Address)

	// 保存到数据库
	address := models.Address{
		UserID:           userID,
		GeneratedAddress: result.Address,
		RealAddress:      realAddress,
		ConvertedAddress: convertedAddress,
		TokenValue:       tokenValue,
		TokenDescription: tokenDescription,
	}

	if err := db.Create(&address).Error; err != nil {
		return "", err
	}

	return convertedAddress, nil
}

func convertRealAddress(realAddress, generatedAddress string) string {
	if realAddress == "" {
		return generatedAddress + "@duck.com"
	}

	// 移除 @duck.com 部分
	generatedPrefix := strings.TrimSuffix(generatedAddress, "@duck.com")

	// 替换 @ 为 _at_
	converted := strings.Replace(realAddress, "@", "_at_", -1)

	// 组合新地址
	return fmt.Sprintf("%s_%s@duck.com", converted, generatedPrefix)
}

// 添加其他必要的服务函数
