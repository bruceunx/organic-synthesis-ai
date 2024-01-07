import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Button,
} from '@chakra-ui/react'

import { DataEntry } from '../types'
import { Link } from 'react-router-dom'

interface dataProps {
  data: DataEntry[]
  onDelete: (id: number) => void
}

const DataTable: React.FC<dataProps> = ({ data, onDelete }) => {
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
              <Td>
                <Link to={`/history/${entry.id}`}>{entry.target}</Link>
              </Td>
              <Td>
                <Button
                  onClick={() => onDelete(entry.id)}
                  color="white"
                  bgColor="red.400"
                  _hover={{ bgColor: 'red.700' }}
                >
                  删除
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  )
}
export default DataTable
