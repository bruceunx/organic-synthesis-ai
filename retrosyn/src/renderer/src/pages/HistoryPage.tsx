import { Flex } from '@chakra-ui/react'
import DataTable from '@renderer/components/DataTable'
import { useEffect, useState } from 'react'
import { DataEntry } from '../types'

const HistoryPage: React.FC = () => {
  const [data, setData] = useState<DataEntry[]>([])

  useEffect(() => {
    const init = async () => {
      const res = await window.electronAPI.onGetFlowList()
      setData(res)
    }
    init()
  }, [])
  // add pagination to Table
  return (
    <Flex direction="column" width="100%" height="100%" align="center">
      <DataTable data={data} />
    </Flex>
  )
}

export default HistoryPage
