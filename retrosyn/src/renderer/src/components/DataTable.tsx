import { Table, Thead, Tbody, Tr, Th, TableContainer } from '@chakra-ui/react'

import { DataEntry } from '../types'
import SingleEntry from './SingleEntry'

interface dataProps {
  data: DataEntry[]
  onDelete: (id: number) => void
}

const DataTable: React.FC<dataProps> = ({ data, onDelete }) => {
  return (
    <TableContainer height="95%" width="70%" my={5} overflowY="scroll">
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
            <SingleEntry entry={entry} onDelete={onDelete} key={idx} />
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  )
}
export default DataTable
