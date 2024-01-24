import { Button, Flex, Text, Select, HStack } from '@chakra-ui/react'
import DataTable from '@renderer/components/DataTable'
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
    updateNumberPage,
  } = usePagination([])

  const onDelete = async (id: number) => {
    const res = await window.electronAPI.onDelFlow(id)
    if (res.changes === 1) updateData(id, currentPage)
  }

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateNumberPage(parseInt(e.target.value))
  }

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
        <HStack>
          <Text width={16}>每页数量</Text>
          <Select width={20} onChange={onChange}>
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </Select>
        </HStack>
      </Flex>
    </Flex>
  )
}

export default HistoryPage
