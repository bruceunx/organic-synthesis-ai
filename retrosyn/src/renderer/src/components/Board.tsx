import { useEffect, useState } from 'react'
import { Flex, Text } from '@chakra-ui/react'
import Search from './Search'
import Chart from './Chart'
import { Node } from 'reactflow'
import ReactionList from './ReactionList'
import ConditionList from './ConditionList'
import NodeDetail from './NodeDetail'
// import NodeDetail from "./NodeDetail";
// import RouteDetail from "./RouteDetail";

function Board(): React.ReactNode {
  const [currentNode, setCurrentNode] = useState<Node | null>(null)

  const [routes, setRoutes] = useState([])
  const [conditions, setConditions] = useState([])

  //eslint-disable-next-line
  const [selectCondition, setSelectCondition] = useState<any>({})

  console.log(selectCondition)

  useEffect(() => {
    const _currentNode = window.localStorage.getItem('currentNode')
    if (_currentNode !== null) setCurrentNode(JSON.parse(_currentNode))
    const _routes = window.localStorage.getItem('routes')
    if (_routes !== null) setRoutes(JSON.parse(_routes))
    const _conditions = window.localStorage.getItem('conditions')
    if (_conditions !== null) setConditions(JSON.parse(_conditions))
  }, [])

  useEffect(() => {
    window.localStorage.setItem('routes', JSON.stringify(routes))
  }, [routes])

  useEffect(() => {
    window.localStorage.setItem('conditions', JSON.stringify(conditions))
  }, [conditions])

  useEffect(() => {
    window.localStorage.setItem('currentNode', JSON.stringify(currentNode))
  }, [currentNode])

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
          height="100%%"
          direction="column"
          borderRight="1px"
          borderColor="gray.400"
        >
          {Boolean(routes.length) && currentNode && (
            <ReactionList routes={routes} currentNode={currentNode!} />
          )}
          {Boolean(conditions.length) && (
            <ConditionList
              conditions={conditions}
              currentNode={currentNode}
              setSelectCondition={setSelectCondition}
            />
          )}
        </Flex>
        <Flex
          width="25%"
          height="100%"
          align="center"
          direction="column"
          gap="2"
          style={{ backgroundColor: 'var(--gray-a4)' }}
        >
          <Text align="center">{currentNode ? '当前目标' : '未选中目标'} </Text>
          <Flex width="80%" height="100%" direction="column">
            {currentNode && currentNode.type === 'chemNode' && (
              <NodeDetail setRoutes={setRoutes} currentNode={currentNode} />
            )}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default Board
