export default interface IModalProps {
  title: string,
  close: () => void,
  isOpen: boolean,
  children?: React.ReactNode
}