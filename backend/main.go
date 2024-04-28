package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

func main() {
	http.HandleFunc("/api/search", searchHandler)
	http.ListenAndServe(":8081", nil)
}

func searchHandler(w http.ResponseWriter, r *http.Request) {
	queryParams := r.URL.Query()

	q, ok := queryParams["q"]
	if !ok || len(q) == 0 {
		http.Error(w, "Param q is missing", http.StatusBadRequest)
		return
	}

	endpoint := fmt.Sprintf("https://newsapi.org/v2/everything?q=%s&apiKey=%s", q[0], "8eca8ad8afbb42aea3a72d8cf8e466c7")
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
	Articles     []Article `json:"articles"`
}
