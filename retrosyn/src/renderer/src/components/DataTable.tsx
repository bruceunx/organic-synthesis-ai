import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from '@chakra-ui/react'

import { DataEntry } from '../types'

interface dataProps {
  data: DataEntry[]
}

const DataTable: React.FC<dataProps> = ({ data }) => {
  return (
    <TableContainer height="90%" width="70%" py={5}>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th fontSize="20">编号</Th>
            <Th fontSize="20">时间</Th>
            <Th fontSize="20">目标</Th>
            <Th fontSize="20">删除</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.map((entry, idx) => (
            <Tr key={idx}>
              <Td>{entry.id}</Td>
              <Td>{entry.time_stamp}</Td>
              <Td>{entry.target}</Td>
              <Td>删除</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  )
}
export default DataTable
