import { useParams, Link } from 'react-router'

export default function DetailsPage() {
  const { id } = useParams()
  return (
    <Link to={'/applications/' + id + '/edit' }>
      Başvuruyu Düzenle #{ id }
    </Link>
  )
}