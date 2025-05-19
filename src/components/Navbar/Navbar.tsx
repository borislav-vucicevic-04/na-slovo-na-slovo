import NavItem from '../NavItem/NavItem'
import Style from './Navbar.module.css'

// Ikonice
import HelpIcon from './../../../public/icons/help.svg'
import DownloadIcon from './../../../public/icons/download.svg'
import UploadIcon from './../../../public/icons/upload.svg'
import InfoIcon from './../../../public/icons/info.svg'
import QuitIcon from './../../../public/icons/quit.svg'

// Interfejsi
import INavBarProps from '../../interfaces/navBarProps.interface'

export default function Navbar(props: INavBarProps) {
  return (
    <div className={Style.navbar}>
      <NavItem iconPath={HelpIcon} title='Uputsvta' onClick={props.toggleHelpDialog} />
      <NavItem iconPath={DownloadIcon} title='Izvezi progres' onClick={props.exportProgress} />
      <NavItem iconPath={UploadIcon} title='Uvezi progres' onClick={props.importProgress} />
      <NavItem iconPath={InfoIcon} title='Reference' onClick={props.toggleInfoDialog} />
      <NavItem iconPath={QuitIcon} title='Obriši progres' onClick={props.deleteSavedProgress} />
    </div>
  )
}
