import ITileProps from "../../interfaces/tileProps.interface";
import Style from './Tile.module.css'

export default function Tile(props: ITileProps) {
  const className = `${Style.tile} ${props.isOpen ? Style.open : ''}`
  return (
    <div className={className}>{props.content}</div>
  )
}
