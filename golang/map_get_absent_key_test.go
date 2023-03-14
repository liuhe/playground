package golang_test

import (
	"fmt"
	"testing"
)

func TestMapGetAbsentKey(t *testing.T) {
	m := make(map[string]bool)
	m["ka"] = true
	fmt.Println("Hello")
	fmt.Printf("ka: %v\n", m["ka"])
	fmt.Printf("kb: %v\n", m["kb"])
}
