import Board from '@renderer/components/Board'
import { ReactFlowProvider } from 'reactflow'

const HomePage: React.FC = () => {
  return (
    <ReactFlowProvider>
      <Board id={null} />
    </ReactFlowProvider>
  )
}

export default HomePage
