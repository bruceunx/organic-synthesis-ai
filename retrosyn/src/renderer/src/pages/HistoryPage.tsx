import { Flex } from '@chakra-ui/react'
import DataTable from '@renderer/components/DataTable'
import { useEffect, useState } from 'react'
import { DataEntry } from '../types'

const HistoryPage: React.FC = () => {
  const [data, setData] = useState<DataEntry[]>([])

  const onDelete = async (id: number) => {
    const res = await window.electronAPI.onDelFlow(id)
    if (res.changes === 1) setData(data.filter((d) => d.id !== id))
  }

  useEffect(() => {
    const init = async () => {
      const res = await window.electronAPI.onGetFlowList()
      console.log(res)
      setData(res)
    }
    init()
  }, [])
  // add pagination to Table
  return (
    <Flex direction="column" width="100%" height="100%" align="center">
      <DataTable data={data} onDelete={onDelete} />
    </Flex>
  )
}

export default HistoryPage
