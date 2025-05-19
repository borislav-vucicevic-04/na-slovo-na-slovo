# Na slovo, na slovo

**"Na slovo, na slovo"** is a word-guessing browser game created as a university project. It is built using **React with TypeScript** and designed for Serbian-speaking audiences.

🔗 [🎮 Play the game online](https://borislav-vucicevic-04.github.io/na-slovo-na-slovo/)

📄 [📘 Project documentation (elaborate in Serbian)](https://apeironedu-my.sharepoint.com/:b:/g/personal/borislav_vucicevic_apeiron-edu_eu/EXFcMq5L70pEjpQ9fSV3cWMBLIpo-ceyvCVZhfs3K3Iq8g?e=EkcWgv)

📁 [📚 Wordlist used](https://github.com/kkrypt0nn/wordlists)

---

## 🎮 Gameplay Overview

- The game is in **Serbian**, targeting native speakers.
- The goal is to guess the hidden Serbian word letter by letter.
- Players have **10 lives** (9 wrong attempts allowed).
- Correct guesses earn **points and coins**. Longer words give higher rewards.
- **Each letter costs coins**, with **vowels and the letter R** costing more.
- A **one-time purchase of 3 lives** is available after losing.
- **Hints** (descriptive sentences) can be bought once and reused during the round.

---

## 💾 Progress & Encryption

- Game progress is stored **locally in the browser** using `localStorage`.
- All data is **encrypted using CryptoJS** before storage.
- Players can:
  - **Export** their progress to a file.
  - **Import** saved progress later.
  - **Reset** progress to start the game from scratch.

---

## 🧠 Features

- 🎯 **Levels**: Progressively harder word challenges.
- 💰 **Coins & Points**: Reward system for strategic guessing.
- 💡 **Hints**: Optional, one-time unlock per word.
- 🆘 **Help Dialog**: Explains gameplay, rules, rewards, and more.
- 🧾 **Icon References Dialog**: Lists sources for all icons used in the app.
- 🛡 **Client-side only**: No backend or server—everything runs in the browser.

---

## 🛠️ Technologies Used

- **React** with **TypeScript**
- **CryptoJS** – used for encrypting data saved in `localStorage`
- **Vite** (or Create React App, if used) for development and build

---

## 📚 Documentation

For detailed technical and functional explanations of the project, refer to the elaborate:

📄 [Elaborate PDF (Serbian)](https://apeironedu-my.sharepoint.com/:b:/g/personal/borislav_vucicevic_apeiron-edu_eu/EXFcMq5L70pEjpQ9fSV3cWMBLIpo-ceyvCVZhfs3K3Iq8g?e=EkcWgv)

---

## 📜 License & Credits

- This project is created for **educational purposes** as part of university coursework.
- Wordlist: [kkrypt0nn/wordlists](https://github.com/kkrypt0nn/wordlists)
- Icon references are listed in the app via the "References" dialog.

---

## 🙋‍♂️ Author

Made with ❤️ by **Borislav Vučicević**  
For coursework at **APEIRON University**

