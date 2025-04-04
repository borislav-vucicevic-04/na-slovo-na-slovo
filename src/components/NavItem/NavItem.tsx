import Style from './NavItem.module.css'
import INavItemProps from '../../interfaces/navItemProps.interfacte'

export default function NavItem(props: INavItemProps) {
  return (
    <button className={Style.navItem} title={props.title} onClick={props.onClick}>
      <img src={props.iconPath} alt={props.title} />
    </button>
  )
}