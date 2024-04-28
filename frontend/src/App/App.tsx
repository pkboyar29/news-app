import styles from './App.module.css'
import Header from '../components/Header/Header'
import { useEffect, useState } from 'react'

function App() {

   const [articles, setArticles] = useState<any[]>([])

   useEffect(() => console.log(articles), [articles])

   function formatDate(date: string) {
      const formattedDate = new Date(date).toLocaleDateString('ru-RU', {
         year: 'numeric',
         month: 'long',
         day: 'numeric',
      })

      return formattedDate
   }


   return (
      <>
         <Header changeArticles={setArticles} />
         <div className={styles["content"]} >
            {articles.map(
               article =>
                  <div className={styles["article"]}>
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
