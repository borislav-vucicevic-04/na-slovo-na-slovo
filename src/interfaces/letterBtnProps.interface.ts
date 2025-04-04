export default interface ILetterBtnProps {
  isCorrect: boolean | null,
  index: number,
  letter: string,
  disabled: boolean,
  onClick: (chosenLetterBtn: ILetterBtnProps) => void
}