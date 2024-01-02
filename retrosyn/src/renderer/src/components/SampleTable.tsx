import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from '@chakra-ui/react'

const SampleTable: React.FC = () => {
  return (
    <TableContainer height="90%" width="80%" py={5}>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>编号</Th>
            <Th>时间</Th>
            <Th>目标</Th>
            <Th>删除</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>1</Td>
            <Td>2022-12-21</Td>
            <Td>CCC</Td>
            <Td>删除</Td>
          </Tr>
          <Tr>
            <Td>2</Td>
            <Td>2022-12-21</Td>
            <Td>CCCC</Td>
            <Td>删除</Td>
          </Tr>
          <Tr>
            <Td>3</Td>
            <Td>2022-12-21</Td>
            <Td>CCCC</Td>
            <Td>删除</Td>
          </Tr>
        </Tbody>
      </Table>
    </TableContainer>
  )
}
export default SampleTable
