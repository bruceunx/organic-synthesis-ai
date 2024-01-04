import React, { useEffect, useState } from 'react'
import {
  Flex,
  RadioGroup,
  Table,
  Tr,
  Tbody,
  Th,
  Thead,
  TableContainer,
} from '@chakra-ui/react'
import Reaction from './Reaction'
import { useReactFlow, Node, Edge } from 'reactflow'

type Route = {
  reactants: string
  plausibility: number
}

type reactionsProps = {
  routes: Route[]
  currentNode: Node
}

const ReactionList: React.FC<reactionsProps> = ({ routes, currentNode }) => {
  const [defaultValue, setDefaultValue] = useState<string>('0')
  const [tempNodes, setTempNodes] = useState<Node[]>([])
  const [tempEdges, setTempEdges] = useState<Edge[]>([])

  const { addEdges, addNodes, setEdges, setNodes, fitView } = useReactFlow()

  const generateNode = async (smiles: string, idx: number, value: number) => {
    // eslint-disable-next-line
    // @ts-ignore
    const svg = await window.electronAPI.onGetSvg(smiles)
    if (svg === null) {
      return null
    } else {
      const svgUrl = `data:image/svg+xml,${encodeURIComponent(svg)}`

      const _id = `chemNode_${currentNode.id}_${idx}_${value}`
      if (idx % 2 === 1) idx *= -1
      const offsetY = 100 * idx
      return {
        id: _id,
        type: 'chemNode',
        data: { imgUrl: svgUrl, isLeaf: true, smiles: smiles },
        position: {
          x: currentNode.position.x - 300,
          y: currentNode.position.y + offsetY,
        },
      }
    }
  }

  const generateEdge = (chemNode: Node, reactionNode: Node) => {
    const _id = `e${chemNode.id}-${reactionNode.id}`
    return {
      id: _id,
      source: `${chemNode.id}`,
      target: `${reactionNode.id}`,
      type: 'smoothstep',
    }
  }

  useEffect(() => {
    setTempNodes([])
    setTempEdges([])
    setDefaultValue('0')
  }, [currentNode])

  const onChange = async (value: string) => {
    setDefaultValue(value)

    if (tempNodes.length > 0) {
      // eslint-disable-next-line
      // @ts-ignore
      setNodes((nodes) => nodes.filter((node) => !tempNodes.includes(node.id)))
    }
    if (tempEdges.length > 0) {
      // eslint-disable-next-line
      // @ts-ignore
      setEdges((edges) => edges.filter((edge) => !tempEdges.includes(edge.id)))
    }

    setTempNodes([])
    setTempEdges([])

    const route = routes[value]
    const reactants = route.reactants.split('.')

    const newChemNodes = []

    for (let i = 0; i < reactants.length; i++) {
      const node = await generateNode(reactants[i], i, Number.parseInt(value))
      if (node !== null) {
        // eslint-disable-next-line
        // @ts-ignore
        newChemNodes.push(node)
      }
    }

    const newReactionNode = {
      id: `reactionNode_${currentNode.id}`,
      type: 'reactionNode',
      data: {
        condition: '#R',
        reactants: route.outcome,
        product: currentNode.data.smiles,
      },
      position: {
        x: currentNode.position.x - 120,
        y: currentNode.position.y + 24,
      },
    }

    const newEdges = newChemNodes.map((chemNode: Node) =>
      generateEdge(chemNode, newReactionNode),
    )
    newEdges.push({
      id: `e${newReactionNode.id}-${currentNode.id}`,
      source: newReactionNode.id,
      target: currentNode.id,
      type: 'smoothstep',
    })

    // eslint-disable-next-line
    // @ts-ignore
    newChemNodes.push(newReactionNode)
    // eslint-disable-next-line
    // @ts-ignore
    setTempNodes(newChemNodes.map((node) => node.id))
    // eslint-disable-next-line
    // @ts-ignore
    setTempEdges(newEdges.map((edge) => edge.id))

    addNodes(newChemNodes)
    addEdges(newEdges)

    function sleep(milliseconds: number) {
      return new Promise((resolve) => setTimeout(resolve, milliseconds))
    }
    await sleep(1000)

    fitView()
  }
  return (
    <Flex
      width="100%"
      height="100%"
      align="center"
      direction="column"
      overflowY="scroll"
    >
      <RadioGroup onChange={onChange} value={defaultValue} width="100%">
        <TableContainer>
          <Table variant="simple" align="center" height="100%">
            <Thead>
              <Tr>
                <Th fontSize="20">评分</Th>
                <Th fontSize="20">原料</Th>
                <Th fontSize="20">反应</Th>
                <Th fontSize="20">目标</Th>
                <Th fontSize="20">选择</Th>
              </Tr>
            </Thead>
            <Tbody width="100%">
              {routes.map((route: Route, idx: number) => (
                <Reaction
                  reactants={route.reactants}
                  plausibility={route.plausibility}
                  target={currentNode.data.imgUrl}
                  key={idx}
                  idx={idx}
                />
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </RadioGroup>
    </Flex>
  )
}

export default ReactionList
