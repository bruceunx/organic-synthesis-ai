import Board from '@renderer/components/Board'
import { ReactFlowProvider } from 'reactflow'

const HomePage: React.FC = () => {
  return (
    <ReactFlowProvider>
      <Board />
    </ReactFlowProvider>
  )
}

export default HomePage
