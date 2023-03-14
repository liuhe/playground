package golang_test

import (
	"fmt"
	"testing"
)

type A struct{}
type B struct{}

func (a *A) test1() {
	fmt.Sprintln(("test a"))
}

func (b *B) test1() {
	fmt.Sprintln(("test b"))
}

func TestZerobase(t *testing.T) {
	a := &A{}
	b := &A{}
	c := new(A)
	d := &A{}
	fmt.Println(c)
	fmt.Println(d)
	fmt.Println(a == b)
	fmt.Println(c == d)
}
