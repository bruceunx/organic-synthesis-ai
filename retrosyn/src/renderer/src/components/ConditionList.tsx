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
import Condition from './Condition'
import { useReactFlow } from 'reactflow'

const ConditionList: React.FC<any> = ({
  conditions,
  currentNode,
  setSelectCondition,
}) => {
  const { setNodes } = useReactFlow()

  const [value, setValue] = useState<string>('-1')

  const onChange = (value: string) => {
    setValue(value)
    const condition = conditions[parseInt(value)]
    console.log(condition)
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === currentNode.id) {
          node.data = { ...node.data, detail: JSON.stringify(condition) }
        }
        return node
      }),
    )
    setSelectCondition(condition)
  }
  useEffect(() => {
    setValue('-1')
  }, [currentNode])

  return (
    <Flex
      width="100%"
      height="100%"
      align="center"
      direction="column"
      overflowY="scroll"
    >
      <RadioGroup onChange={onChange} value={value} width="100%">
        <TableContainer>
          <Table variant="simple" align="center" height="100%">
            <Thead>
              <Tr>
                <Th fontSize="20">评分</Th>
                <Th fontSize="20">试剂</Th>
                <Th fontSize="20">溶剂</Th>
                <Th fontSize="20">催化剂</Th>
                <Th fontSize="20">温度</Th>
                <Th fontSize="20">选择</Th>
              </Tr>
            </Thead>
            <Tbody width="100%">
              {conditions.map((condition: any, idx: number) => (
                <Condition condition={condition} idx={idx} key={idx} />
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </RadioGroup>
    </Flex>
  )
}

export default ConditionList
