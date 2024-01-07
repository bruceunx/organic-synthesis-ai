import Board from '@renderer/components/Board'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ReactFlowProvider } from 'reactflow'

const SingleHistoryEntry: React.FC = () => {
  const params = useParams()
  const [id, setId] = useState<number | null>(null)

  useEffect(() => {
    if (params.id !== undefined) setId(Number.parseInt(params.id))
  }, [params])

  return <ReactFlowProvider>{id && <Board id={id} />}</ReactFlowProvider>
}

export default SingleHistoryEntry
