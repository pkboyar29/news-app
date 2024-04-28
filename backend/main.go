package main

import (
	"encoding/json"
	"fmt"
	"math"
	"net/http"
	"strconv"
	"time"

	"github.com/rs/cors"
)

func main() {

	mux := http.NewServeMux()
	mux.HandleFunc("/api/search", searchHandler)

	c := cors.New(cors.Options{
		AllowedOrigins: []string{"http://localhost:5173"},
	})
	// создаем экземляр CORS middleware, разрешая всем
	handler := c.Handler(mux) // обертываем маршрутизатор в CORS middleware

	http.ListenAndServe(":8080", handler)
}

func searchHandler(w http.ResponseWriter, r *http.Request) {
	queryParams := r.URL.Query()

	q, ok := queryParams["q"]
	if !ok || len(q) == 0 {
		http.Error(w, "Param q is missing", http.StatusBadRequest)
		return
	}

	language := queryParams["language"]

	pageSize := 10

	pageStr, ok := queryParams["page"]
	var page int
	if ok {
		page, _ = strconv.Atoi(pageStr[0])
	} else {
		page = 1 // Устанавливаем значение по умолчанию
	}

	endpoint := fmt.Sprintf("https://newsapi.org/v2/everything?q=%s&language=%s&pageSize=%d&page=%d&sortBy=publishedAt&apiKey=%s", q[0], language[0], pageSize, page, "8eca8ad8afbb42aea3a72d8cf8e466c7")
	resp, err := http.Get(endpoint)
	if err != nil {
		http.Error(w, "Error contacting News API", http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		http.Error(w, "News API returned non-200 status code", resp.StatusCode)
		return
	}

	var results Results
	err1 := json.NewDecoder(resp.Body).Decode(&results)
	if err1 != nil {
		http.Error(w, "Error decoding response from News API", http.StatusInternalServerError)
		return
	}

	// работа с данными
	results.TotalPages = int(math.Ceil(float64(results.TotalResults / pageSize)))

	jsonResponse, err2 := json.Marshal(results)
	if err2 != nil {
		http.Error(w, "Error encoding response to JSON", http.StatusInternalServerError)
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonResponse)
}

type Source struct {
	ID   interface{} `json:"id"`
	Name string      `json:"name"`
}

type Article struct {
	Source      Source    `json:"source"`
	Author      string    `json:"author"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	URL         string    `json:"url"`
	URLToImage  string    `json:"urlToImage"`
	PublishedAt time.Time `json:"publishedAt"`
	Content     string    `json:"content"`
}

type Results struct {
	Status       string    `json:"status"`
	TotalResults int       `json:"totalResults"`
	TotalPages   int       `json:"totalPages"`
	Articles     []Article `json:"articles"`
}
