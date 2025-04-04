import React, { Component } from 'react'
import Style from './Main.module.css'
import GAMES from './../../words.json'
import CryptoJS from 'crypto-js'

// Slike
import RedHeart from './../../../public/assets/red-heart.svg'
import GrayHeart from './../../../public/assets/gray-heart.svg'
import Coin from './../../../public/assets/coin.svg'
import LightBulb from './../../../public/assets/light-bulb.svg'

// Interfejsi
import IProgress from '../../interfaces/progress.interface'
import ILetterBtnProps from '../../interfaces/letterBtnProps.interface'
import LetterBtn from '../LetterBtn/LetterBtn'
import ITileProps from '../../interfaces/tileProps.interface'

// Komponenete
import Tile from '../Tile/Tile'

// Slova koja se koriste
const LETTERS = "abcčćdđefghijklmnoprsštuvzž"
// Maksimalan broj života
const MAX_NUMBER_OF_LIVES = 10;
// Maksimalan level
const MAX_LEVEL_NUMBER = 20;
// Broj riječi koji se otključava po levelu
const WORDS_PER_LEVEL = 20;
// Cijene slova
const LETTER_COST = {'a-e': 20, 'i-o': 10, 'u-r': 5, 'default': 1};
// Cijena nagovjeptaja
const HINT_COST = 35;
// Cijena dodatnih zivota
const EXTRA_LIVES_COST = 45;
// Osnovna nagrada koja se dobija za pogađanje riječi
const BASE_PRIZE = 35;
// broj za koji se granica potrebnih poena za prelazak nivoa se povećava
const MAX_POINTS_INCREMENT = 250
// Broj novčića koje korisnik osvaja prelaskom levela
const LEVEL_UP_PRIZE = 25;
// Broj novčića koje korisnik dobija kao kompenzaciju kada izgubi
const COMPENSATION = 30;
interface IState {
  progress: IProgress,
  lives: number,
  word: string,
  hint: string,
  isHintPaidFor: boolean,
  hasBeenSaved: boolean,
  tiles: ITileProps[],
  letterBtns: ILetterBtnProps[]
}
export default class Main extends Component<{}, IState> {
  constructor(props: {}) {
    super(props);
    // metode
    this.generateHearts = this.generateHearts.bind(this);
    this.loadProgress = this.loadProgress.bind(this);
    this.getGame = this.getGame.bind(this);
    this.generateLetterBtsProps = this.generateLetterBtsProps.bind(this);
    this.chooseLetter = this.chooseLetter.bind(this);
    this.revealHint = this.revealHint.bind(this);
    this.submitWord = this.submitWord.bind(this);
    this.calculatePrize = this.calculatePrize.bind(this);
    this.victory = this.victory.bind(this);
    this.defeat = this.defeat.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    // konstante
    const currentGame = this.getGame();
    const tiles = currentGame.word.split('').map(() => { return {content: '?', isOpen: false}})
    const letterBtns = this.generateLetterBtsProps();
    const progress = this.loadProgress();
    this.state = {
      progress,
      lives: MAX_NUMBER_OF_LIVES,
      word: currentGame.word,
      hint: currentGame.hint,
      isHintPaidFor: false,
      hasBeenSaved: false,
      tiles,
      letterBtns
    }
  }
  loadProgress(): IProgress {
    const progressJSON  = localStorage.getItem("progress");
    
    if(progressJSON === null) {
      const initialProgress: IProgress = {
        level: 1,
        points: 0,
        maxPointsForLevel: 500,
        coins: 200,
        usedWords: []
      }
      this.saveProgress(initialProgress)
      return initialProgress
    }
    else {
      const bytes = CryptoJS.AES.decrypt(progressJSON, import.meta.env.VITE_SECRET_KEY);
      const decryptedProgress = bytes.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decryptedProgress) as IProgress
    }
  }
  saveProgress(progress: IProgress) {
    const encryptedProgress = CryptoJS.AES.encrypt(JSON.stringify(progress), import.meta.env.VITE_SECRET_KEY).toString();
    localStorage.setItem("progress", encryptedProgress);
  }
  // Ova metoda generiše srca
  generateHearts() {
    let hearts: React.ReactNode[] = [];
    let maxGrayHearts = MAX_NUMBER_OF_LIVES - this.state.lives;
    let key = 0;
    // Ubacivanje crvenih srca
    for(let i = 0; i < this.state.lives; i++) {
      hearts.push(<img src={RedHeart} className={Style.heart} alt='red-heart' key={key++}/>)
    }
    if(maxGrayHearts > 0) {
      // Ubacivanje prvog sivog srca
      hearts.push(<img src={GrayHeart} className={`${Style.heart} ${Style.shaking}`} alt='gray-heart' key={key++}/>);
      // Ubacivanje ostalih sivih srca
      for(let i = 0, l = maxGrayHearts - 1; i < l; i++) {
        hearts.push(<img src={GrayHeart} className={Style.heart} alt='gray-heart' key={key++}/>)
      }
    }
    return hearts;
  }
  // Ova metoda generiše properties za komponente LetterBtn
  generateLetterBtsProps(): ILetterBtnProps[] {
    let letterBtns: ILetterBtnProps[] = LETTERS.split('').map((l, index) => {
      return {
        letter: l,
        isCorrect: null,
        index,
        disabled: false,
        onClick: this.chooseLetter
      }
    });
    return letterBtns
  }
  // Ova metoda uzima nasumično jednu riječ iz liste riječi i njen naogvještaj
  getGame(): {word: string, hint: string} {
    let progress = this.loadProgress();
    let currentLvl = progress.level;
    // Opseg riječi za trenutni level
    let availableWords = GAMES.slice(0, currentLvl * WORDS_PER_LEVEL) 
    // Riječi koje igrač nije pogađao
    let unusedWords = availableWords.filter(item => !progress.usedWords.includes(item.word))
    let currentGame = {word: '', hint: ''};
    if(unusedWords.length > 0) {
      let gameNumber = Math.floor(Math.random() * unusedWords.length);
      currentGame = unusedWords[gameNumber];
    }
    else {
      let gameNumber = Math.floor(Math.random() * availableWords.length);
      currentGame = availableWords[gameNumber];
      progress.usedWords = [];
    }
    progress.usedWords.push(currentGame.word)
    this.saveProgress(progress);
    return currentGame;
  }
  // Ovom metodom provjerava se da li se odabrano slovo nalazi u riječi
  chooseLetter(chosenLetterBtn: ILetterBtnProps) {
    const word = this.state.word;
    const tiles = this.state.tiles;
    const letterBtns = this.state.letterBtns;
    const newLetterBtnProps = {...chosenLetterBtn}
    let lives = this.state.lives;
    let progress = this.state.progress;
    let cost = LETTER_COST['default'];
    
    // Korisnik je izabrao samoglasnik
    if("aeiour".includes(chosenLetterBtn.letter)) {
      // Korisnik potvrđuje da li želi kupiti samoglasnik
      // Samoglasnici imaju različite cijene tako da bi i poruka trebala biti drugačija
      switch(chosenLetterBtn.letter) {
        case 'a': case 'e': cost = LETTER_COST['a-e']; break;
        case 'i': case 'o': cost = LETTER_COST['i-o']; break;
        case 'u': case 'r': cost = LETTER_COST['u-r']; break;
        default: break;
      }
      // Provjeravamo da li korisnik pristaje na kupovinu. Ako da, metoda se izvršava, ako ne izlazimo iz metode
      if(!confirm(`Oprez!\n\n Slovo '${chosenLetterBtn.letter}' je skuplje od ostalih!\n\nCijena ovog slova je: ${cost}`))
        return
    }
    // provjeravamo da li korisnik ima dovoljno novčića da kupi slovo
    // ako nema, izlazimo iz metode. Ako ima, metoda nastavlja sa izvršavanjem
    if(progress.coins < cost) {
      alert('Nemate dovoljno novčića!');
      // izlaz iz metode
      return;
    }
    // Sada oduzimamo cijenu slova od novčića
    progress.coins -= cost
    // Sada provjeravamo da li se izabrano slovo nalazi u riječi
    if(word.indexOf(chosenLetterBtn.letter) > -1){
      // Prikazivanje slova na tabli
      for(let i = 0, l = word.length; i < l; i++) {
        // ukoliko je trenutno slovo riječi različito od izabranog, preskačemo ovu iteraciju
        if(word[i] !== chosenLetterBtn.letter) continue;
        // ukoliko je trenutno slovo riječi isto kao i izabrano, prikazujemo ga na tabli sa pogođenim slovima
        tiles[i].content = chosenLetterBtn.letter;
        tiles[i].isOpen = true;
      }
      newLetterBtnProps.isCorrect = true;
      newLetterBtnProps.disabled = true;
    }
    else {
      lives--;
      newLetterBtnProps.isCorrect = false;
      newLetterBtnProps.disabled = true;
    }
    letterBtns[chosenLetterBtn.index] = newLetterBtnProps;
    this.setState({
      tiles,
      letterBtns,
      lives,
      progress,
    }, () => {
      if(this.state.lives === 0) this.defeat();
    })
  }
  // Ovom metodom otkriva se nagovještaj. Plaća se jednom tokom igre
  revealHint() {
    let progress = this.state.progress;
    // Ako je nagovještaj plaćen, prikaže se i izađe iz metode
    if(this.state.isHintPaidFor) {
      alert(`NAGOVJEŠTAJ: ${this.state.hint}`)
      return
    }
    // ako nagovještaj nije plaćen, treba utvrditi da li korisnik ima dovoljno novčića. Ako nema izlazimo iz metode
    if(this.state.progress.coins < HINT_COST) {
      alert("Nemate dovoljno novčića!");
      return;
    }
    // Ako korisnik ima dovoljno novčića, korisnik potvrđuje radnju. Ako odbije, izlazimo iz metode.
    if(!confirm(`Da li želite da prikažete nagovještaj?\n\nOPREZ: Ova radnja košta ${HINT_COST} novčića`)) {
      return
    }
    progress.coins -= HINT_COST;
    alert(`NAGOVJEŠTAJ: ${this.state.hint}`);
    this.setState({
      progress,
      isHintPaidFor: true
    })
  }
  // Ovom metodom korisnik pogađa riječ
  submitWord() {
    const userInput = prompt('Unesite riječ:');

    // provjeravamo korisnikov unos. Ako je neispravan izlazimo iz metode
    if(userInput?.toLowerCase() !== this.state.word) {
      alert("Nije tačno! Pokušaj ponovo! 🎯");
      return;
    }
    this.victory();
  }
  // Ovom metodom računamo broj novčića i poena koje korisnik zaradi kada pobjedi
  calculatePrize(): number {
    let bns = this.state.tiles.filter(t => t.isOpen === false).length; // broj neotkrivenih slova u riječi;
    let bos = this.state.word.length - bns; // broj otkrivenih slova
    let pz = this.state.lives; // broj preostalih života
    let bg = this.state.letterBtns.filter(lb => lb.isCorrect === false).length; // broj grešaka
    let ns = this.state.letterBtns.filter(lb => lb.disabled === false).length;
    
    return BASE_PRIZE + bns * 8 + bos * 4 + pz * 3 + Math.floor(ns / 2) - bg * 3;
  }
  // Ovu metodu pozivamo kada korisnik pobjedi
  victory() {
    let progress = {...this.state.progress};
    const prize = this.calculatePrize();
    // Računanje nagrade
    progress.coins += prize;
    progress.points += prize;
    alert(`Čestitamo! Tačan odgovor! 🎉\n\nOsvojeni poeni: ${prize}\nOsvojeni novčići: ${prize}`);
    // Prelazak na sledeći nivo ukoliko je korisnik ostvario dovoljan broj poena
    if(progress.points >= progress.maxPointsForLevel && progress.level < MAX_LEVEL_NUMBER) {
      progress.points -= progress.maxPointsForLevel;
      progress.maxPointsForLevel += MAX_POINTS_INCREMENT;
      progress.level++;
      progress.coins += LEVEL_UP_PRIZE;
      alert(`Čestitamo! Prešli ste na sledeći level 🎉\n\nOsvojeni novčići: ${LEVEL_UP_PRIZE}`);
    }
    // čuvanje novog progresa
    this.saveProgress(progress)
    // kreiranje nove igre
    const currentGame = this.getGame();
    const tiles = currentGame.word.split('').map(() => { return {content: '?', isOpen: false}})
    const letterBtns = this.generateLetterBtsProps();
    this.setState({
      progress,
      lives: MAX_NUMBER_OF_LIVES,
      word: currentGame.word,
      hint: currentGame.hint,
      isHintPaidFor: false,
      hasBeenSaved: false,
      tiles,
      letterBtns
    })
  }
  // Ovu metodu pozivamo kada korisnik izgubi
  defeat() {
    let progress = {...this.state.progress};
    // provjeravamo da li korisnik ima dovoljno novčića da kupi 3 dodatna života. Ovo je moguće učiniti samo jednom pa je potrebno provjeriti da li je to korisnik već uradio.
    if(progress.coins >= EXTRA_LIVES_COST && this.state.hasBeenSaved === false) {
      let message = `Ups! Izgubili ste sve živote! 😱\n\nNe brinite, još uvek imate šansu! Možete kupiti 3 dodatna života i pokušati ponovo za ${EXTRA_LIVES_COST} novčića.\n\nOvu šansu imate samo jednom! \n\nŽelite li da nastavite?`
      if(confirm(message)) {
        progress.coins -= EXTRA_LIVES_COST;
        this.setState({
          lives: 3,
          progress,
          hasBeenSaved: true
        });
        return;
      }
    }
    // ako nisu ispunjena prethodna tri uslova, onda se potvrđuje da je igrač izgubio
    alert(`Ups! Izgubili ste sve živote! 😔\n\nZadata riječ je bila: ${this.state.word}.\n\nNe brini, kao kompenzaciju dobijaš ${COMPENSATION} novčića kako bi mogao da nastaviš igru. Iskoristi ovu šansu i ponovo se bori za pobjedu! 💪`);
    progress.coins += COMPENSATION;
    // čuvanje novog progresa
    this.saveProgress(progress)
    // kreiranje nove igre
    const currentGame = this.getGame();
    const tiles = currentGame.word.split('').map(() => { return {content: '?', isOpen: false}})
    const letterBtns = this.generateLetterBtsProps();
    this.setState({
      progress,
      lives: MAX_NUMBER_OF_LIVES,
      word: currentGame.word,
      hint: currentGame.hint,
      isHintPaidFor: false,
      hasBeenSaved: false,
      tiles,
      letterBtns
    })
  }
  handleKeyPress(event: KeyboardEvent) {
    // izlazimo iz funkcije ako igrač nije pritisnuo slovo
    if(!LETTERS.includes(event.key)) return;
    const chosenLetter = this.state.letterBtns[LETTERS.indexOf(event.key)];
    // provjeravamo da li je slovo već iskorišteno
    if(chosenLetter.isCorrect !== null) return;
    this.chooseLetter(chosenLetter)
  };
  componentDidMount(): void {
    window.addEventListener('keypress', this.handleKeyPress)
  }
  componentWillUnmount(): void {
    window.removeEventListener('keypress', this.handleKeyPress)
  }
  render() {
    return (
      <div className={Style.main}>
        {/* Zaglavlje */}
        <div className={Style.header}>
          <div className={Style.headerItem}>{this.state.progress.level}</div>
          <div className={Style.progressBarWrapper}>
            <div className={Style.progressBar} 
              style={{
                width: `${this.state.progress.level >= MAX_LEVEL_NUMBER ? 100 : ((this.state.progress.points / this.state.progress.maxPointsForLevel) * 100).toFixed(2)}%`
              }}
            >
            </div>
            <span>{`${this.state.progress.level >= MAX_LEVEL_NUMBER ? this.state.progress.points : `${this.state.progress.points} / ${this.state.progress.maxPointsForLevel}`}`}</span>
          </div>
          <img src={Coin} alt={'coin'}  className={Style.coin} />
          <div  className={Style.headerItem}>{this.state.progress.coins}</div>
        </div>
        {/* Broj života */}
        <div className={Style.heartsContainer}>{this.generateHearts()}</div>
        <div className={Style.wordContainer}>
          {this.state.tiles.map((t, index) => <Tile {...t} key={index} />)}
        </div>
        {/* Specijalna dugmad */}
        <div className={Style.specialBtnsContainer}>
          <button className={Style.specialBtn} onClick={this.submitWord}>rješenje</button>
          <button className={Style.specialBtn} onClick={this.revealHint}>
            <img src={LightBulb} alt='light-bulb' />
          </button>
        </div>
        {/* Tabela sa slovima */}
        <div className={Style.lettersContainer}>{
          this.state.letterBtns.map(letterBtn => <LetterBtn {...letterBtn} key={letterBtn.letter} />)
        }</div>
      </div>
    )
  }
}
