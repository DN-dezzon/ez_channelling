package main

import (
	"encoding/hex"
	"fmt"
	"mime"
	"net/http"
	"path/filepath"

	"github.com/denisbrodbeck/machineid"
)

var port = ":4200"

func indexHandler(w http.ResponseWriter, req *http.Request) {
	id, err := machineid.ID()

	if req.URL.Path == "/" {
		req.URL.Path = "/index.html"
	}

	encodedUrl := hex.EncodeToString([]byte(req.URL.Path))
	//cloud 5e5208c5cf4f4c6194b3ee19c41440ba
	if err != nil || id != "a25e75ed-eac1-4678-a511-8425c38b6c41" {
		encodedUrl = hex.EncodeToString([]byte("/assets/unregistered.html"))
	}

	decodedContent, _ := hex.DecodeString(files[encodedUrl])
	contentType := mime.TypeByExtension(filepath.Ext(req.URL.Path))

	w.Header().Set("Content-Type", contentType)
	if contentType == "" {
		fmt.Print(req.URL.Path + "\n")
	}
	//fmt.Print(id)
	w.Write(decodedContent)
}

func main() {
	mime.AddExtensionType(".map", "application/octet-stream")
	mime.AddExtensionType(".woff2", "font/woff2")
	http.HandleFunc("/", indexHandler)
	if err := http.ListenAndServe(port, nil); err != nil {
		panic(err)
	}
}
