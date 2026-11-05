import { useParams } from 'react-router'

export default function Detail() {
  const { id } = useParams()
  return <h1>Text #{ id }</h1>
}