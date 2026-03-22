package utils

import (
	"context"
	"server/config"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
)

func UploadToCloudinary(base64Str string) (string, error) {
	cld, err := cloudinary.NewFromParams(
		config.AppConfig.CloudinaryCloudName,
		config.AppConfig.CloudinaryAPIKey,
		config.AppConfig.CloudinaryAPISecret,
	)
	if err != nil {
		return "", err
	}

	ctx := context.Background()
	uploadResult, err := cld.Upload.Upload(ctx, base64Str, uploader.UploadParams{
		Folder: "tiinpod/designs",
	})
	if err != nil {
		return "", err
	}

	return uploadResult.SecureURL, nil
}
