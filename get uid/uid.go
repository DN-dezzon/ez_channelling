package main

import (
	"fmt"

	"github.com/denisbrodbeck/machineid"
)

func main() {
	id, err := machineid.ID()
	if err != nil {
		fmt.Print("error")
	} else {
		fmt.Print(id)
	}
}
