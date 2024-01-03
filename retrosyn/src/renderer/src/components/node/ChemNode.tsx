import { memo } from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import { Flex, Image } from '@chakra-ui/react'
import { ChemNodeData } from '../../types'

const ChemNode: React.FC<NodeProps<ChemNodeData>> = ({
  data,
}: {
  data: ChemNodeData
}) => {
  const handleStyle = {
    width: '2px',
    height: '10px',
    borderRadius: '1px',
    backgroundColor: '#778899',
  }

  return (
    <Flex direction="column" bgColor="green.200" borderRadius={10} gap="2">
      <Handle style={handleStyle} type="target" position={Position.Left} />
      <Image src={data.imgUrl} borderRadius={10} alt="chem" />
      {!data.isTarget && (
        <Handle style={handleStyle} type="source" position={Position.Right} />
      )}
    </Flex>
  )
}
export default memo(ChemNode)
