import { Button, Text, Image, Flex } from '@chakra-ui/react'

import { NodeProps } from '../types'
import { useState } from 'react'
import { useReactFlow } from 'reactflow'

const NodeDetail: React.FC<NodeProps> = ({ currentNode, setRoutes }) => {
  const [text, setText] = useState<string>('开始AI设计')
  const [error, setError] = useState<boolean>(false)

  const { setNodes } = useReactFlow()

  const onClick = async () => {
    setText('正在设计中...')
    setError(false)

    const routes = await window.electronAPI.onFindRoutes(
      currentNode.data.smiles,
    )
    if (routes === null) {
      setError(true)
    } else {
      const _routes: any[] = []
      for (let idx = 0; idx < 10; idx++) {
        _routes.push({
          reactants: routes.reactants[idx],
          plausibility: routes.scores[idx],
        })
      }
      // eslint-disable-next-line
      // @ts-ignore
      setRoutes(_routes)
      setNodes((nodes) =>
        nodes.map((node) => {
          if (node.id === currentNode.id) {
            node.data = { ...node.data, isLeaf: false }
          }
          return node
        }),
      )
    }

    setText('开始AI设计')
  }

  return (
    <Flex direction="column" align="center" gap="4">
      <Image
        src={currentNode.data.imgUrl}
        alt="currentNode"
        width={270}
        height={270}
        bgColor="blue.400"
        borderRadius={20}
      />
      {currentNode.data.isLeaf && (
        <Button borderRadius="full" variant="outline" onClick={onClick}>
          {text}
        </Button>
      )}
      {error && (
        <Text size="1" color="red">
          无法设计:( 可以再次尝试
        </Text>
      )}
    </Flex>
  )
}

export default NodeDetail
