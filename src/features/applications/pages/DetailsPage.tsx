import { useParams } from 'react-router'

export default function DetailsPage() {
  const { id } = useParams()
  return <h1>Başvuru #{ id }</h1>
}