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
    <TableContainer height="90%" py={5}>
      <Table size="sm">
        <Thead>
          <Tr>
            <Th>VIN</Th>
            <Th>时间</Th>
            <Th>状态</Th>
            <Th>图表</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>inches</Td>
            <Td>2022-12-21</Td>
            <Td>OK</Td>
            <Td>link</Td>
          </Tr>
          <Tr>
            <Td>inches</Td>
            <Td>2022-12-21</Td>
            <Td>NG</Td>
            <Td>link</Td>
          </Tr>
          <Tr>
            <Td>inches</Td>
            <Td>2022-12-21</Td>
            <Td>OK</Td>
            <Td>link</Td>
          </Tr>
          <Tr>
            <Td>inches</Td>
            <Td>2022-12-21</Td>
            <Td>OK</Td>
            <Td>link</Td>
          </Tr>
          <Tr>
            <Td>inches</Td>
            <Td>2022-12-21</Td>
            <Td>NG</Td>
            <Td>link</Td>
          </Tr>
        </Tbody>
      </Table>
    </TableContainer>
  )
}
export default SampleTable
