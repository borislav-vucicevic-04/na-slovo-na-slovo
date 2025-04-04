import IModalProps from '../../interfaces/modalProps.interface'
import Style from './Modal.module.css'

export default function Modal(props: IModalProps) {
  return (
    <div className={Style.modalOverlay} style={{display: props.isOpen ? 'flex' : 'none'}}>
      <div className={Style.modal}>
        <div className={Style.modalHeader}>
          <h1>{props.title}</h1>
          <button onClick={props.close}>&#215;</button>
        </div>
        {props.children}
      </div>
    </div>
  )
}
