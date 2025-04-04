import { Component } from 'react'
import CryptoJS from 'crypto-js'
import Style from './App.module.css'
import Navbar from './components/Navbar/Navbar'
import Main from './components/Main/Main'
import Modal from './components/Modal/Modal';

// Reference
import IconReferences from './references.json'
import IconReference from './components/IconReference/IconReference';
import IProgress from './interfaces/progress.interface'

interface State {
  isHelpOpen: boolean,
  isInfoOpen: boolean,
}

export default class App extends Component<{}, State> {
  constructor(props: {}) {
    super(props);
    // metode
    this.toggleHelpDialog = this.toggleHelpDialog.bind(this);
    this.exportProgress = this.exportProgress.bind(this);
    this.importProgress = this.importProgress.bind(this);
    this.toggleInfoDialog = this.toggleInfoDialog.bind(this);
    // state
    this.state = {
      isHelpOpen: true,
      isInfoOpen: false,
    }
  }
  // Ovu metodu korstimo da otvorimo / zatvorimo help dialog
  toggleHelpDialog() {
    this.setState({
      isHelpOpen: !this.state.isHelpOpen
    })
  }
  // Ovu metodu koristimo da korisnik preuzme progres na računar
  exportProgress() {
    const text = localStorage.getItem('progress')!;
    const fileType = 'plain/text';
    const fileName = 'na_slovo_na_slovo_progres_backup.txt'

    var blob = new Blob([text], { type: fileType });
  
    var a = document.createElement('a');
    a.download = fileName;
    a.href = URL.createObjectURL(blob);
    a.dataset.downloadurl = [fileType, a.download, a.href].join(':');
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function() { URL.revokeObjectURL(a.href); }, 1500);
  }
  // Ovu metodu koristimo da korisnik uveze sačuvani progres u aplikaciju
  importProgress () {
    const filePicker = document.createElement('input');
    filePicker.type = 'file';
    filePicker.setAttribute('accept', 'text/plain')
    filePicker.addEventListener('change', (e: Event) => {
      e.preventDefault()
      const reader = new FileReader()
        reader.onload = async (e) => { 
          try {
            const text = (e.target!.result);

            if(text === null) throw "";

            const bytes = CryptoJS.AES.decrypt(text.toString(), import.meta.env.VITE_SECRET_KEY);
            const decryptedProgress = bytes.toString(CryptoJS.enc.Utf8);
            const progress = JSON.parse(decryptedProgress) as IProgress;

            if(!(progress.level && progress.maxPointsForLevel && progress.coins && progress.points)) {
              throw ""
            }
            else{
              const encryptedProgress = CryptoJS.AES.encrypt(JSON.stringify(progress), import.meta.env.VITE_SECRET_KEY).toString();
              localStorage.setItem("progress", encryptedProgress);
              alert("Uspješno ste učitali Vaš progres u igrici!\n\nSada će se aplikacija osvježiti!");
              window.location.reload();
            }
          }
          catch(error) {
            alert("Odabrani fajl je nevažeći!")
          }
        };
        reader.readAsText((e.target! as any).files[0])
    })
    filePicker.click();
  }
  // Ovu metodu korstimo da otvorimo / zatvorimo help dialog
  toggleInfoDialog() {
    this.setState({
      isInfoOpen: !this.state.isInfoOpen
    })
  }
  deleteSavedProgress() {
    let msg1 = `1️⃣ UPOZORENJE! ⚠️\n\nBrisanjem svog progresa izgubićeš sve podatke o igrama, osvojenim novčićima i nivou. Ova radnja je nepovratna i ne može se poništiti!\n\n👉 Da li si siguran da želiš nastaviti?`;
    let msg2 = `POSLJEDNJE UPOZORENJE! 🚨\n\nAko potvrdiš, svi tvoji podaci će biti trajno izgubljeni. Ne postoji način da ih povratiš! \n\n🔄 Ova akcija će resetovati cijeli tvoj napredak.`;
    let msg3 = `3️⃣ BRISANJE U TOKU... ❌\n\nTvoj progres će sada biti trajno obrisan! Sve će biti resetovano kao da nikada nisi igrao.\n\n🛑 Ako nisi potpuno siguran, prekini sada!`;
    let successMsg = `✅ Progres uspješno obrisan!\n\nSvi podaci su resetovani. 🎯\n\nPočinješ iznova, kao da nikada nisi igrao!\n\nNAPOMENA: Aplikacija će se sada osvježiti!\n\n🔄 Srećno u novom pokušaju!`
    if(!confirm(msg1)) return;
    if(!confirm(msg2)) return;
    if(!confirm(msg3)) return;
    localStorage.removeItem('progress');
    alert(successMsg)
    window.location.reload();
  }
  render() {
    return (
      <div className={Style.container}>
        <Navbar 
          toggleHelpDialog={this.toggleHelpDialog}
          exportProgress={this.exportProgress}
          importProgress={this.importProgress}
          toggleInfoDialog={this.toggleInfoDialog}
          deleteSavedProgress={this.deleteSavedProgress}
         />
        <Main />
        <Modal title={'Uputstva za igru'} isOpen={this.state.isHelpOpen} close={this.toggleHelpDialog}>
          <span>{`Dobrodošli u igru `}<strong>"Na slovo, na slovo"</strong>{`! U ovoj igri vaša misija je da pogodite skrivenu riječ, koristeći ograničeni broj pokušaja i resurse kao što su samoglasnici i nagovještaji. Svaka tačno pogodjena riječ donosi vam nagradu, dok svaki pogrešan odgovor oduzima jedan život!`}</span>
          <h2>{`1. Kako igrati`}</h2>
          <span>U igri "Na slovo, na slovo", Vaš zadatak je da pogodite skrivenu riječ. Svaka riječ se sastoji od slova, a vi imate mogućnost da pogodite jedno slovo po jedanput. Ako pogodite slovo koje je u riječi, ono će biti otkriveno. Ukoliko pogriješite, izgubićete jedan život. Igrači imaju ukupno 10 života, što znači da možete napraviti najviše 9 grešaka prije nego što izgubite igru. Svaka greška oduzima jedan život.</span>
          <h2>2. Kupovina samoglasnika i nagovještaja</h2>
          <span>Novčiće koji se nalaze u Vašoj kasi, možete koristiti za kupovinu slova i/ili nagovještaja koji će vam pomoći u pogađanju riječi. Samoglasnici i nagovještaji su posebni resursi koji mogu biti od velike pomoći u igri.
            <strong>Cijene su sljedeće:</strong>
            <ul>
              <li>Slova <strong>a</strong> i <strong>e</strong> – 20 novčića</li>
              <li>Slova <strong>i</strong> i <strong>o</strong> – 10 novčića</li>
              <li>Slova <strong>u</strong> i <strong>r</strong> – 5 novčića</li>
              <li>Ostala slova - 1 novčić</li>
              <li>Nagovještaj za cijelu riječ – 35 novčića</li>
            </ul>
          Međutim, imajte na umu da kupovina samoglasnika ne garantuje da će ti samoglasnici biti prisutni u riječi. Kupovina samoglasnika i nagovještaja zahtijeva pažljivo planiranje, jer trošenje previše novčića bez garancije da će oni pomoći može biti rizično.
          <br/>
          Novčićima možete kupiti i dodatne živote. Ukoliko izgubite sve živote, pružiće Vam se mogućnost da kupite 3 dodatna života za samo 45 novčića. Dodatna 3 života možete kupiti samo jednom tokom jednog kruga igre.
          </span>
          <h2>3. Novčići</h2>
          <span>Kao što je prethodno rečeno, novčići služe kako biste kupili samoglasnike, nagovještaje kao i dodatne živote. Novčići se dobijaju na 3 načina:
          <ul>
            <li><strong>Prvi način: </strong> pobjeđivanje! Svaki put kada pobijedite, to jeste pogodite riječ, budete nagrađeni određenim brojem novčića. 
            <br></br>
            Formula za računanje novičića je: <em>osnovna nagrada (35 nočića)</em> + <em>broj neotkrivenih slova</em>*8 + <em>broj otkrivenih slova</em>*4 + <em>preostali životi</em>*3 + <em>neiskorištena slova</em>/2 - <em>broj grešaka</em>*3</li>  
            <li><strong>Drugi način:</strong> svaki put kada pređete na sledeći level igre. Nagrada za prelazek na viši level igre je 25 novčića</li>
            <li><strong>Treći način: </strong> kompenzacija za poraz. Svaki put kada izgubite, kao kompenzaciju dobijete 30 novčića.</li>
          </ul>  
          </span>
          <h2>4. Poeni i leveli</h2>
          <span>Svaki put kada pogodite riječi, dobijate određeni broj poena. Broj poena se računa po istoj formuli kao i broj novčića. Poeni služe kako biste napredovali kroi igru i prelazili na viši level.
          <br></br>
          Prelaskom na viši level, dobijate 25 novčića kao nagradu i opseg mogućih riječi povećava se za 20. Drugim riječima riječima rečeno, na svakom novom levelu rječnik iz kojeg se izvvlače tražene riječi se povećava za 20. Početna granica za prelazak na novi level je 500. Prelaskom na svaki sledeći level, grnica se povećava za 250.</span>
          <h2>5. Čuvanje progresa</h2>
          Progres (napredak) u igri se čuva dirketno u Vašem pretraživaču. Jako je bitno i da svaki put prije nego što izađete iz igre, izvezete sačuvani progres iz aplikacije i sačuvate na Vašem lokalnom računaru. Iz nepredvidivih razloga, moguće je da se progres izgubi (ažuriranje pretraživača, brisanje kolačića i sl.).
          <br/><br/>
          Ako želite sačuvati svoj trenutni progres, potrebno je da kliknete na dugme "Izvezi progres" (drugo dugme u navigacionoj traci) u podešavanjima igre. Vaš progres će biti preuzet kao fajl pod nazivom <em>"na_slovo_na_slovo_progres_backup.txt"</em>. Ovaj fajl treba sačuvati na svom uređaju kako biste ga kasnije mogli učitati. Uvijek čuvajte ovaj fajl na sigurnom mjestu kako ne biste izgubili svoj napredak. 
          <br/><br/>
          Ako želite vratiti prethodno sačuvan progres, potrebno je da kliknete na dugme "Uvezi progres" u podešavanjima igre. Nakon toga, pojaviće se prozor za odabir fajla, gdje treba da pronađete i izaberete prethodno sačuvani progress.json fajl. Kada se fajl učita, vaš progres će biti vraćen i moći ćete nastaviti igru tamo gdje ste stali. Pazite da ne koristite pogrešan fajl, jer neispravan format može izazvati greške u učitavanju.
          <br/><br/>
          Koristeći ove opcije, možete jednostavno sačuvati i vratiti svoj progres, osiguravajući da ne izgubite svoj trud u igri.
          <span></span>
          <h2>6. Sretno i uživajte u igri!</h2>
          <span>Sada kada znate kako igra funkcioniše, možete početi da uživate u izazovima koje pruža igra "Na slovo, na slovo". Sretno u otkrivanju riječi, planiranju vaše strategije za korištenje resursa i ostvarivanju što boljih rezultata!</span>
        </Modal>
        <Modal title={'Reference'} isOpen={this.state.isInfoOpen} close={this.toggleInfoDialog}>
          {IconReferences.map((ir, index) => <IconReference {...ir} key={index} />)}
        </Modal>
      </div>
    )
  }
}