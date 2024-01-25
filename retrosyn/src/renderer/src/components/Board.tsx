import { Flex, Text } from '@chakra-ui/react'
import Search from './Search'
import Chart from './Chart'
import ReactionList from './ReactionList'
import ConditionList from './ConditionList'
import NodeDetail from './NodeDetail'
import RouteDetail from './ConditionDetail'
import useBoard from '@renderer/hooks/useBoard'

function Board({ id }: { id: number | null }): React.ReactNode {
  const {
    routes,
    conditions,
    currentNode,
    selectCondition,
    handleSelect,
    setRoutes,
    setConditions,
    setCurrentNode,
    setSelectCondition,
  } = useBoard(id)

  return (
    <Flex direction="column" width="100%" height="100%" align="center">
      {id === null && (
        <Search
          setRoutes={setRoutes}
          setConditions={setConditions}
          setCurrentNode={setCurrentNode}
        />
      )}
      <Flex width="100%" height="40%">
        <Chart handleSelect={handleSelect} id={id} />
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
            {currentNode && currentNode.type === 'reactionNode' && (
              <RouteDetail
                setConditions={setConditions}
                currentNode={currentNode}
                selectCondition={selectCondition}
              />
            )}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default Board
