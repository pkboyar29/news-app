package main

import (
	"fmt"
	"net/http"
)

func main() {
	http.HandleFunc("/api/hello-world", testHandler)
	http.ListenAndServe(":8081", nil)
}

func testHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprint(w, "Hello world")
}
