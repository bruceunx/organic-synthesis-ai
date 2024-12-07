import { useEffect, useState } from 'react'
import { Node } from 'reactflow'

const useBoard = (id: number | null) => {
  const [currentNode, setCurrentNode] = useState<Node | null>(null)

  const [routes, setRoutes] = useState([])
  const [conditions, setConditions] = useState([])

  //eslint-disable-next-line
  const [selectCondition, setSelectCondition] = useState<any>({})

  useEffect(() => {
    if (id === null) {
      const _currentNode = window.localStorage.getItem('currentNode')
      if (_currentNode !== null) setCurrentNode(JSON.parse(_currentNode))
      const _routes = window.localStorage.getItem('routes')
      if (_routes !== null) setRoutes(JSON.parse(_routes))
      const _conditions = window.localStorage.getItem('conditions')
      if (_conditions !== null) setConditions(JSON.parse(_conditions))
    }
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

  return {
    handleSelect,
    setRoutes,
    setConditions,
    setCurrentNode,
    selectCondition,
    setSelectCondition,
    routes,
    conditions,
    currentNode,
  }
}

export default useBoard
