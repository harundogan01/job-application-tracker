import { Link } from 'react-router'

const applications = [
  { id: 1, company: 'Penta Yazılım', position: 'Frontend Developer' },
  { id: 2, company: 'XXX Yazılım', position: 'Frontend Developer' },
  { id: 3, company: 'YYY Yazılım', position: 'Frontend Developer' }
];

export default function ListPage() {
  return (
    <div>
      <h1>Applications</h1>
      <ul>
        {applications.map(application => (
          <li key={application.id}>
            <Link to={'/applications/' + application.id}
              className="text-blue-600 hover:underline">
              {application.company } - { application.position }  #{ application.id }
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}