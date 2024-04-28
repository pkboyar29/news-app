import axios from 'axios'
import styles from './Header.module.css'
import { useState } from 'react'

interface HeaderProps {
   changeArticles: (articles: any[], totalResults: number) => void
}

function Header({ changeArticles }: HeaderProps) {

   const [searchText, setSearchText] = useState<string>("")
   const [selectedLang, setSelectedLang] = useState<string>("")
   const [isOpen, setIsOpen] = useState<boolean>(false)

   enum LangCode {
      all = 'Все языки',
      ar = 'Арабский',
      de = 'Немецкий',
      en = 'Английский',
      es = 'Испанский',
      it = 'Итальянский',
      no = 'Норвежский',
      pt = 'Португальский',
      ru = 'Русский',
      sv = 'Шведский',
      zh = 'Китайский'
   }

   // Создаем обратный словарь для обратного маппирования значений и ключей
   const LangCodeReverseMap: Record<string, LangCode> = {};
   for (const langCode in LangCode) {
      const value = LangCode[langCode as keyof typeof LangCode];
      if (typeof value === 'string') {
         LangCodeReverseMap[value] = langCode as LangCode;
      }
   }

   // Функция для получения названия элемента перечисления по его значению
   function getLangCodeName(value: LangCode): string | undefined {
      return LangCodeReverseMap[value];
   }

   function handleClick() {
      console.log(selectedLang)
      axios.get(`http://localhost:8080/api/search?q=${searchText}&language=${selectedLang}`)
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

   function toggleDropMenu() {
      setIsOpen(!isOpen)
   }

   function handleItemClick(langCode: LangCode) {
      const headerLanguageElement = document.querySelector(`.${styles["header__language"]}`) as HTMLElement
      headerLanguageElement.textContent = langCode

      const langName = getLangCodeName(langCode);
      if (langName === "all") {
         setSelectedLang("");
      }
      else if (langName !== undefined) {
         setSelectedLang(langName);
      }
      else {
         console.log("Error")
      }
   }

   return (
      <div className={styles["header"]}>
         <div className={styles["header__logo"]}>Using News API</div>
         <div className={styles["header__right"]}>
            <input placeholder="Введите текст" onChange={handleChange} type="text" className={styles["header__input"]} />
            <div className={styles["header__dropdown"]}>
               <button onClick={toggleDropMenu} className={styles["header__language"]}>Выбрать язык</button>
               {isOpen && (
                  <ul className={styles["dropdown__menu"]}>
                     <li onClick={() => handleItemClick(LangCode.all)} className={styles["dropdown__item"]}>{LangCode.all}</li>
                     <li onClick={() => handleItemClick(LangCode.ar)} className={styles["dropdown__item"]}>{LangCode.ar}</li>
                     <li onClick={() => handleItemClick(LangCode.de)} className={styles["dropdown__item"]}>{LangCode.de}</li>
                     <li onClick={() => handleItemClick(LangCode.en)} className={styles["dropdown__item"]}>{LangCode.en}</li>
                     <li onClick={() => handleItemClick(LangCode.es)} className={styles["dropdown__item"]}>{LangCode.es}</li>
                     <li onClick={() => handleItemClick(LangCode.it)} className={styles["dropdown__item"]}>{LangCode.it}</li>
                     <li onClick={() => handleItemClick(LangCode.no)} className={styles["dropdown__item"]}>{LangCode.no}</li>
                     <li onClick={() => handleItemClick(LangCode.pt)} className={styles["dropdown__item"]}>{LangCode.pt}</li>
                     <li onClick={() => handleItemClick(LangCode.ru)} className={styles["dropdown__item"]}>{LangCode.ru}</li>
                     <li onClick={() => handleItemClick(LangCode.sv)} className={styles["dropdown__item"]}>{LangCode.sv}</li>
                     <li onClick={() => handleItemClick(LangCode.zh)} className={styles["dropdown__item"]}>{LangCode.zh}</li>
                  </ul>
               )}
            </div>
            <div onClick={handleClick} className={styles["header__button"]}>Поиск</div>
         </div>
      </div>
   )

}

export default Header