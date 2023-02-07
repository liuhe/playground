package main

import "ericliu.net/playground/golang-interface-test/mod1"

type Impl struct {
}

func (i Impl) GetAge() int {
	return 0
}

func NewX() mod1.TheInf {
	return &Impl{}
}
