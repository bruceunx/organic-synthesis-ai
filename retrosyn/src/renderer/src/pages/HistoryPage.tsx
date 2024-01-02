import { Flex } from '@chakra-ui/react'
import SampleTable from '@renderer/components/SampleTable'

const HistoryPage: React.FC = () => {
  // add pagination to Table
  return (
    <Flex direction="column" width="100%" height="100%" align="center">
      <SampleTable />
    </Flex>
  )
}

export default HistoryPage
