import { Button, ButtonGroup, Flex, HStack, Input } from '@chakra-ui/react'
import SampleTable from '@renderer/components/SampleTable'

const HistoryPage: React.FC = () => {
  return (
    <Flex direction="column" width="100%" height="100%">
      <HStack height="10%" width="100%" justify="center" pt={2}>
        <label style={{ width: 'auto' }}>查询日期</label>
        <Input type="date" width="100" value="2023-12-12" />
        <ButtonGroup>
          <Button>查询</Button>
          <Button>保存</Button>
        </ButtonGroup>
      </HStack>
      <SampleTable />
    </Flex>
  )
}

export default HistoryPage
