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
  useReactFlow,
} from 'reactflow'
import 'reactflow/dist/style.css'
import '../style/flow.css'

import ReactionNode from './node/ReactionNode'
import ChemNode from './node/ChemNode'
import { useCallback, MouseEvent, useState, useEffect } from 'react'
import { Button, Flex, useToast } from '@chakra-ui/react'

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
  id: number | null
}

const Chart: React.FC<ChartProps> = ({ handleSelect, id }: ChartProps) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [delKey, setDelKey] = useState<string>('')
  const [init, setInit] = useState<number>(0)

  const refFlow = useReactFlow()
  const toast = useToast()

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
    if (refFlow) {
      const flow = refFlow.toObject()
      const content = JSON.stringify(flow) // content
      const targetNode = nodes.filter((node) => node.data.isTarget === true)[0]
      let res: any
      if (id === null) {
        res = await window.electronAPI.onSaveFlow(
          targetNode.data.smiles,
          content,
        )
      } else {
        res = await window.electronAPI.onUpdateFlow(id, content)
      }
      if (res.changes === 1)
        toast({
          position: 'top-right',
          description: '数据保存成功!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
    }
  }, [refFlow, nodes])

  useEffect(() => {
    if (init !== 0) {
      if (refFlow === null) return
      window.localStorage.setItem(
        'currentFlow',
        JSON.stringify(refFlow.toObject()),
      )
    }
  }, [nodes])

  useEffect(() => {
    const onRestore = (content: string) => {
      const restoreFlow = async (content: string) => {
        if (refFlow === null) return
        const flow = JSON.parse(content)
        if (flow) {
          const { x = 0, y = 0, zoom = 1 } = flow.viewport
          refFlow.setNodes(flow.nodes || [])
          refFlow.setEdges(flow.edges || [])
          refFlow.setViewport({ x, y, zoom })
        }
      }
      restoreFlow(content)
    }
    const _initRecord = async (seconds: number) => {
      if (init === 0) {
        await new Promise((resolve) => setTimeout(resolve, seconds))
        setInit(1)
      }
    }
    const getContent = async (id: number) => {
      const reaction = await window.electronAPI.onGetFlow(id)
      onRestore(reaction.content)
    }
    if (id !== null) {
      getContent(id)
    } else {
      const _currentFlow = window.localStorage.getItem('currentFlow')
      if (_currentFlow !== null) {
        onRestore(_currentFlow)
      }
    }
    _initRecord(1000)
  }, [refFlow])

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
