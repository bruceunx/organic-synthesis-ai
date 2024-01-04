import { memo } from 'react'
import { Flex, Text } from '@chakra-ui/react'
import { Handle, Position, NodeProps } from 'reactflow'
import { ReactNodeData } from '../../types'

const ReactionNode: React.FC<NodeProps<ReactNodeData>> = ({
  data,
}: {
  data: ReactNodeData
}) => {
  const handleStyle = {
    width: '2px',
    height: '2px',
    borderRadius: '2px',
    backgroundColor: '#778899',
  }

  return (
    <Flex
      direction="column"
      gap="2"
      width="40px"
      height="40px"
      borderRadius="20px"
      bgColor="red.400"
      color="white"
      align="center"
      justify="center"
      _hover={{ bgColor: 'red.600' }}
    >
      <Handle style={handleStyle} type="target" position={Position.Left} />
      <Text align="center">{data.condition}</Text>
      <Handle style={handleStyle} type="source" position={Position.Right} />
    </Flex>
  )
}
export default memo(ReactionNode)
