package main

type A struct {
	A int
}

type B struct {
	A   A
	PA  *A
	PPA **A
}

func main() {
	var b *B = new(B)
	println(b.A.A) // 0

	if b.PPA == nil {
		println("b.PPA is nil")
	} else {
		println("b.PPA is not nil")
	}

	b.PPA = new(*A)
	if b.PPA == nil {
		println("b.PPA is nil")
	} else {
		println("b.PPA is not nil")
	}

	var pa = &A{}
	b.PPA = &pa
	println((*b.PPA).A) // 0
}
