import styles from './App.module.css'
import Header from '../components/Header/Header'
import { useEffect, useState } from 'react'

function App() {

   const [articles, setArticles] = useState<any[]>([])
   const [totalResults, setTotalResults] = useState<number>(0)

   useEffect(() => console.log(articles), [articles])

   function formatDate(date: string) {
      const formattedDate = new Date(date).toLocaleDateString('ru-RU', {
         year: 'numeric',
         month: 'long',
         day: 'numeric',
      })

      return formattedDate
   }

   function changeArticles(articles: any[], totalResults: number) {
      setArticles(articles)
      setTotalResults(totalResults)
   }


   return (
      <>
         <Header changeArticles={changeArticles} />

         <div className={styles["content"]} >

            <div className={styles["articles__info"]}>
               {totalResults === 0 ? <>Результатов не было найдено</> : <>Около {totalResults} результатов было найдено</>}
            </div>

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
