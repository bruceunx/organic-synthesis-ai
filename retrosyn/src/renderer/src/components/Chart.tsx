import ReactFlow, {
  Background,
  useEdgesState,
  useNodesState,
  MarkerType,
  Node,
  Panel,
  getIncomers,
  getConnectedEdges,
  getOutgoers,
} from 'reactflow'
import 'reactflow/dist/style.css'

import ReactionNode from './node/ReactionNode'
import ChemNode from './node/ChemNode'
import { useCallback, MouseEvent, useState } from 'react'
import { Button, Flex } from '@chakra-ui/react'

const nodeTypes = {
  chemNode: ChemNode,
  reactionNode: ReactionNode,
}

const defaultEdgeOptions = {
  style: { strokeWidth: 2, stroke: 'blue' },
  animated: true,
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: 'blue',
  },
}

type ChartProps = {
  handleSelect: (node: Node | null) => void
}

const Chart: React.FC<ChartProps> = ({ handleSelect }: ChartProps) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [rfInstance, setRfInstance] = useState(null)
  const [delKey, setDelKey] = useState<string>('')

  const onNodeClick = useCallback(
    (_: MouseEvent, node: Node) => {
      handleSelect(node)
      if (node.type == 'reactionNode') {
        setDelKey('Delete')
      } else {
        setDelKey('')
      }
    },
    [handleSelect, setDelKey],
  )
  const onSave = useCallback(async () => {
    if (rfInstance) {
      // @ts-ignore-next-line
      const flow = rfInstance.toObject()
      const content = JSON.stringify(flow) // content
      console.log(content)
      // const target = analysis.getNodeLink().smiles; // get target smiles
      // @ts-ignore-next-line
      // const res = await saveRoute(session.accessToken, target, content);
    }
  }, [rfInstance])

  const onNodesDelete = useCallback(
    // eslint-disable-next-line
    (deleted: any) => {
      handleSelect(null)
      let incomes = deleted
      const removeNodes: Node[] = []
      const removeNodeIds: string[] = []
      const preNode = getOutgoers(deleted[0], nodes, edges)[0]
      while (incomes.length > 0) {
        const firtIncome = incomes.shift()
        removeNodes.push(firtIncome!)
        removeNodeIds.push(firtIncome!.id)
        const newIncomers = getIncomers(firtIncome!, nodes, edges)
        if (newIncomers.length > 0) incomes = incomes.concat(newIncomers)
      }
      //@ts-ignore-next-line
      const connectedEdges = getConnectedEdges(removeNodes, edges)
      const remainingEdges = edges.filter(
        (edge) => !connectedEdges.includes(edge),
      )
      let remainingNodes = nodes.filter(
        (node) => !removeNodeIds.includes(node.id),
      )

      remainingNodes = remainingNodes.map((node) => {
        if (node.id === preNode.id) {
          node.data = { ...node.data, isLeaf: true }
        }
        return node
      })

      setEdges(remainingEdges)
      setNodes(remainingNodes)
      setDelKey('')
    },
    [nodes, edges, setNodes, setEdges, handleSelect],
  )

  return (
    <Flex width="100%" height="100%" borderY="1px" borderColor="gray.400">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodeClick={onNodeClick}
        defaultEdgeOptions={defaultEdgeOptions}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodesDelete={onNodesDelete}
        deleteKeyCode={delKey}
        proOptions={{ hideAttribution: true }}
        // @ts-ignore-next-line
        onInit={setRfInstance}
        fitView
      >
        <Background gap={20} />
        <Panel position="top-right">
          <Button onClick={onSave}>保存</Button>
        </Panel>
      </ReactFlow>
    </Flex>
  )
}

export default Chart
