import ILetterBtnProps from '../../interfaces/letterBtnProps.interface'
import Style from './LetterBtn.module.css'

export default function LetterBtn(props: ILetterBtnProps) {
  let additionalClassName = '';

  if(props.isCorrect === true) additionalClassName = Style.correct;
  else if(props.isCorrect === false) additionalClassName = Style.wrong;
  else additionalClassName = ''

  return (
    <button 
      className={`${Style.letterBtn} ${additionalClassName}`} 
      disabled={props.disabled}
      onClick={() => {props.onClick(props)}}
    >{props.letter}</button>
  )
}
