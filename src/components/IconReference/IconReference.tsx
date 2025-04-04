import Style from './IconReference.module.css'
import IIconReferenceProps from "../../interfaces/iconReferenceProps.interface";


export default function IconReference(props: IIconReferenceProps) {
  return (
    <a className={Style.iconReference} href={props.reference} target="_blank" rel="noopener noreferrer">
      <div className={Style.icon}>
        <img src={props.imagePath} />
      </div>
      <span>{props.text}</span>
    </a>
  )
}