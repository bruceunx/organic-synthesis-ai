import Board from '@renderer/components/Board'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ReactFlowProvider } from 'reactflow'

const SingleHistoryEntry: React.FC = () => {
  const params = useParams()
  const [content, setContent] = useState<string | null>(null)

  useEffect(() => {
    const getContent = async (id: number) => {
      const _content = await window.electronAPI.onGetFlow(id)
      setContent(_content)
    }
    if (params.id !== undefined) getContent(Number.parseInt(params.id))
  }, [params])

  return (
    <ReactFlowProvider>
      <Board content={content} />
    </ReactFlowProvider>
  )
}

export default SingleHistoryEntry
