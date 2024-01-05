import { useEffect, useState } from 'react'
import { Button, Flex, Heading, Text, Image } from '@chakra-ui/react'

import { RouteProps } from '../types'

const RouteDetail: React.FC<RouteProps> = ({
  setConditions,
  currentNode,
  selectCondition,
}) => {
  const [text, setText] = useState<string>('反应条件筛选')
  const [error, setError] = useState<boolean>(false)
  const [reagent, setReagent] = useState<string | null>(null)
  const [solvent, setSolvent] = useState<string | null>(null)
  const [catalyst, setCatalyst] = useState<string | null>(null)
  const [temperature, setTemperature] = useuseState<number | null>(null)

  const onClick = async () => {
    setError(false)
    setText('正在筛选中...')
    let result = await window.electronAPI.onFindConditions(
      currentNode.data.reactants,
      currentNode.data.product,
    )
    if (result !== null) {
      result = result.results
      const conditions: any[] = []
      for (let i = 0; i < result[0].length; i++) {
        conditions.push({
          score: result[1][i],
          temperature: result[0][i][0],
          reagent: result[0][i][2],
          solvent: result[0][i][1],
          catalyst: result[0][i][3],
        })
      }
      // eslint-disable-next-line
      // @ts-ignore
      setConditions(conditions)
    } else {
      setError(true)
    }
    setText('反应条件筛选')
  }

  useEffect(() => {
    const updateSvg = async (condition: any) => {
      if (condition.reagent.length > 0) {
        const res = await window.electronAPI.onGetSvg(condition.reagent)
        if (res !== null) {
          const svgUrl = `data:image/svg+xml,${encodeURIComponent(res)}`
          setReagent(svgUrl)
        }
      }
      if (condition.solvent.length > 0) {
        const res = await window.electronAPI.onGetSvg(condition.solvent)
        if (res !== null) {
          const svgUrl = `data:image/svg+xml,${encodeURIComponent(res)}`
          setSolvent(svgUrl)
        }
      }
      if (condition.catalyst.length > 0) {
        const res = await window.electronAPI.onGetSvg(condition.catalyst)
        if (res !== null) {
          const svgUrl = `data:image/svg+xml,${encodeURIComponent(res)}`
          setCatalyst(svgUrl)
        }
      }
      if (condition.temperature !== null) {
        setTemperature(condition.temperature)
      }
    }
    setTemperature(null)
    setReagent(null)
    setSolvent(null)
    setCatalyst(null)
    if (currentNode.data.detail !== undefined) {
      try {
        const condition = JSON.parse(currentNode.data.detail)
        updateSvg(condition)
      } catch (err) {
        return
      }
    }
  }, [currentNode])

  useEffect(() => {
    const updateSvg = async (condition: any) => {
      if (condition.reagent.length > 0) {
        const res = await window.electronAPI.onGetSvg(condition.reagent)
        if (res !== null) {
          const svgUrl = `data:image/svg+xml,${encodeURIComponent(res)}`
          setReagent(svgUrl)
        }
      } else {
        setReagent(null)
      }
      if (condition.solvent.length > 0) {
        const res = await window.electronAPI.onGetSvg(condition.solvent)
        if (res !== null) {
          const svgUrl = `data:image/svg+xml,${encodeURIComponent(res)}`
          setSolvent(svgUrl)
        }
      } else {
        setSolvent(null)
      }
      if (condition.catalyst.length > 0) {
        const res = await window.electronAPI.onGetSvg(condition.catalyst)
        if (res !== null) {
          const svgUrl = `data:image/svg+xml,${encodeURIComponent(res)}`
          setCatalyst(svgUrl)
        }
      } else {
        setCatalyst(null)
      }
      if (condition.temperature !== null) {
        setTemperature(condition.temperature)
      }
    }
    setTemperature(null)
    setReagent(null)
    setSolvent(null)
    setCatalyst(null)
    if (Object.keys(selectCondition).length > 0) {
      try {
        updateSvg(selectCondition)
      } catch (err) {
        return
      }
    }
  }, [selectCondition])

  return (
    <Flex direction="column" gap={3} align="center">
      <Heading py="2">反应条件筛选</Heading>

      <Flex direction="column" gap="2" py="4" align="start" justify="start">
        <Flex direction="row" gap="2">
          <Text width="20">反应试剂:</Text>
          {reagent && (
            <Image
              src={reagent}
              alt="reagent"
              width={70}
              height={70}
              bgColor="blue.200"
              borderRadius={5}
              p={2}
            />
          )}
        </Flex>
        <Flex direction="row" gap="2">
          <Text width="20">反应溶剂:</Text>
          {solvent && (
            <Image
              src={solvent}
              alt="solvent"
              width={70}
              height={70}
              bgColor="gray.200"
              borderRadius={5}
              p={2}
            />
          )}
        </Flex>
        <Flex direction="row" gap="2">
          <Text width="20">催化剂:</Text>
          {catalyst && (
            <Image
              src={catalyst}
              alt="catalyst"
              width={70}
              height={70}
              bgColor="green.200"
              borderRadius={5}
              p={2}
            />
          )}
        </Flex>
        <Text>
          反应温度: &nbsp; {temperature && `${temperature.toFixed(1)}℃ `}
        </Text>
      </Flex>
      <Button borderRadius="full" variant="outline" onClick={onClick}>
        {text}
      </Button>

      {error && (
        <Text size="1" color="red">
          无法获取条件:( 可以再次尝试获取
        </Text>
      )}
    </Flex>
  )
}

export default RouteDetail
