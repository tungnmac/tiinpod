package service

import (
	"encoding/csv"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"server/internal/repository"
)

type FileService interface {
	SaveUpload(fileName string, content io.Reader) (string, error)
	ExportProductsCSV() (string, error)
	ImportProductsCSV(reader io.Reader) error
}

type fileService struct {
	productRepo repository.ProductRepository
}

func NewFileService(p repository.ProductRepository) FileService {
	return &fileService{productRepo: p}
}

func (s *fileService) SaveUpload(fileName string, content io.Reader) (string, error) {
	filePath := filepath.Join("uploads", fileName)
	out, err := os.Create(filePath)
	if err != nil {
		return "", err
	}
	defer out.Close()
	_, err = io.Copy(out, content)
	return filePath, err
}

func (s *fileService) ExportProductsCSV() (string, error) {
	products, err := s.productRepo.FindAll()
	if err != nil {
		return "", err
	}

	fileName := fmt.Sprintf("exports/products_%d.csv", os.Getpid())
	file, err := os.Create(fileName)
	if err != nil {
		return "", err
	}
	defer file.Close()

	writer := csv.NewWriter(file)
	defer writer.Flush()

	writer.Write([]string{"ID", "Name", "Price", "SKU"})
	for _, p := range products {
		writer.Write([]string{
			fmt.Sprintf("%d", p.ID),
			p.Name,
			fmt.Sprintf("%f", p.Price),
			p.SKU,
		})
	}
	return fileName, nil
}

func (s *fileService) ImportProductsCSV(reader io.Reader) error {
	csvReader := csv.NewReader(reader)
	records, err := csvReader.ReadAll()
	if err != nil {
		return err
	}

	// Bỏ qua header
	for i, record := range records {
		if i == 0 {
			continue
		}
		// Giả lập logic import cơ bản
		fmt.Printf("Importing: %v\n", record)
	}
	return nil
}
