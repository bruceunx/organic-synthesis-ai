import { useState } from 'react'
import { Flex, Text } from '@chakra-ui/react'
import Search from './Search'
import Chart from './Chart'
import { Node } from 'reactflow'
// import Reactions from "./Reactions";
// import NodeDetail from "./NodeDetail";
// import RouteDetail from "./RouteDetail";
// import Conditions from "./Conditions";

export default function Board(): React.ReactNode {
  const [currentNode, setCurrentNode] = useState<Node | null>(null)

  const [routes, setRoutes] = useState([])
  const [conditions, setConditions] = useState([])

  //eslint-disable-next-line
  const [selectCondition, setSelectCondition] = useState<any>({})

  console.log(routes, conditions, selectCondition)

  const handleSelect: (s: Node | null) => void = (node: Node | null) => {
    setRoutes([])
    setConditions([])
    setSelectCondition({})
    setCurrentNode(node)
  }

  return (
    <Flex direction="column" width="100%" height="100%" align="center">
      <Search
        setRoutes={setRoutes}
        setConditions={setConditions}
        setCurrentNode={setCurrentNode}
      />
      <Flex width="100%" height="40%">
        <Chart handleSelect={handleSelect} />
      </Flex>
      <Flex height="60%" width="100%" direction="row">
        <Flex
          width="75%"
          height="100%"
          direction="column"
          borderRight="1px"
          borderColor="gray.400"
        ></Flex>
        <Flex
          width="25%"
          height="100%"
          align="center"
          direction="column"
          gap="2"
          style={{ backgroundColor: 'var(--gray-a4)' }}
        >
          <Text align="center">{currentNode ? '当前目标' : '未选中目标'} </Text>
          <Flex width="20%" height="100%" direction="column"></Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}
