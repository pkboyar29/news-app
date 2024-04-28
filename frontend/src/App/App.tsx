import styles from './App.module.css'
import Header from '../components/Header/Header'
import { useEffect, useState } from 'react'
import axios from 'axios'

function App() {

   const [articles, setArticles] = useState<any[]>([])
   const [totalResults, setTotalResults] = useState<number>(0)
   const [totalPages, setTotalPages] = useState<number>(0)
   const [currentPage, setCurrentPage] = useState<number>(1)
   const [currentLang, setCurrentLang] = useState<string>("")
   const [currentSearchText, setCurrentSearchText] = useState<string>("")

   useEffect(() => console.log(articles), [articles])

   function formatDate(date: string) {
      const formattedDate = new Date(date).toLocaleDateString('ru-RU', {
         year: 'numeric',
         month: 'long',
         day: 'numeric',
      })

      return formattedDate
   }

   function searchArticles(articles: any[], totalResults: number, totalPages: number, lang: string, searchText: string) {
      setArticles(articles)
      setTotalResults(totalResults)
      setTotalPages(totalPages)
      setCurrentLang(lang)
      setCurrentSearchText(searchText)
      setCurrentPage(1)
   }

   function changeArticlesPage() {
      axios.get(`http://localhost:8080/api/search?q=${currentSearchText}&page=${currentPage}&language=${currentLang}`)
         .then(response => response.data)
         .then(data => {
            setArticles(data["articles"])
         })
   }

   function pageBack() {
      if (currentPage > 1) {
         setCurrentPage(currentPage - 1)
         changeArticlesPage()
      }
   }

   function pageForward() {
      if (currentPage < totalPages) {
         setCurrentPage(currentPage + 1)
         changeArticlesPage()
      }
   }

   return (
      <>
         <Header searchArticles={searchArticles} />

         <div className={styles["content"]} >

            <div className={styles["articles__info"]}>
               {totalResults === 0 ? <>Результатов не было найдено</> : <>Около {totalResults} результатов было найдено. Вы находитесь на {currentPage} из {totalPages} страниц</>}
            </div>

            {
               totalResults === 0 ? <></> :
                  <div className={styles["pagination"]}>
                     <button onClick={pageBack} className={styles["pagination__back"]}>Назад</button>
                     <button onClick={pageForward} className={styles["pagination__forward"]}>Вперед</button>
                  </div>
            }

            {articles.map(
               (article, index) =>
                  <div className={styles["article"]} key={index}>
                     <div className={styles["article__left"]}>
                        <a href={article.url} className={styles["article__title"]}>{article.title}</a>
                        <p className={styles["article__descr"]}>{article.description}</p>
                        <div className={styles["article__left-bottom"]}>
                           <div className={styles["article__author"]}>{article.source.name}</div>
                           <time dateTime={article.publishedAt} className={styles["article__time"]}>{formatDate(article.publishedAt)}</time>
                        </div>
                     </div>
                     <img className={styles["article__img"]} src={article.urlToImage} alt="" />
                  </div>
            )}
         </div>
      </>
   )
}

export default App
