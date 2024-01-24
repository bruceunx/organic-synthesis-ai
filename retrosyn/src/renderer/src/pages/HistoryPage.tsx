import { Button, Flex, Text } from '@chakra-ui/react'
import DataTable from '@renderer/components/DataTable'
import { useEffect } from 'react'
import usePagination from '@renderer/hooks/usePagination'

const HistoryPage: React.FC = () => {
  const {
    currentPage,
    totalPages,
    visibleData,
    nextPage,
    previousPage,
    firstPage,
    lastPage,
    updateData,
    data,
  } = usePagination([])

  const onDelete = async (id: number) => {
    const res = await window.electronAPI.onDelFlow(id)
    if (res.changes === 1)
      updateData(
        data.filter((d) => d.id !== id),
        currentPage,
      )
  }

  useEffect(() => {
    const init = async () => {
      const res = await window.electronAPI.onGetFlowList()
      updateData(res)
    }
    init()
  }, [])
  // add pagination to Table
  return (
    <Flex direction="column" width="100%" height="100%" align="center">
      <DataTable data={visibleData} onDelete={onDelete} />
      <Flex gap={5} my={3} align="center">
        <Button onClick={firstPage}>首页</Button>
        <Button onClick={previousPage}>上一页</Button>
        <Text>
          {currentPage}/{totalPages}
        </Text>
        <Button onClick={nextPage}>下一页</Button>
        <Button onClick={lastPage}>末页</Button>
      </Flex>
    </Flex>
  )
}

export default HistoryPage
