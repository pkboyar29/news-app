import axios from 'axios'
import styles from './Header.module.css'
import { useState } from 'react'

interface HeaderProps {
   changeArticles: (articles: any[], totalResults: number) => void
}

function Header({ changeArticles }: HeaderProps) {

   const [searchText, setSearchText] = useState<string>("")

   function handleClick() {
      axios.get(`http://localhost:8080/api/search?q=${searchText}`)
         .then(response => response.data)
         .then(
            dataJson => {
               changeArticles(dataJson["articles"], dataJson["totalResults"])
            }
         )
   }

   function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
      setSearchText(event.target.value)
   }

   return (
      <div className={styles["header"]}>
         <div className={styles["header__logo"]}>Using News API</div>
         <div className={styles["header__right"]}>
            <input placeholder="Введите текст" onChange={handleChange} type="text" className={styles["header__input"]} />
            <div onClick={handleClick} className={styles["header__button"]}>Поиск</div>
         </div>
      </div>
   )

}

export default Header