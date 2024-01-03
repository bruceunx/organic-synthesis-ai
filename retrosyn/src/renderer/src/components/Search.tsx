import {
  Button,
  Flex,
  Text,
  InputGroup,
  InputLeftElement,
  Input,
} from '@chakra-ui/react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'

import { Dispatch, SetStateAction, useState } from 'react'
import { Node, useReactFlow } from 'reactflow'

// const ChemEditor = lazy(() => import('./ChemEditor'))
import ChemEditor from './ChemEditor'

export default function Search({
  setRoutes,
  setConditions,
  setCurrentNode,
}: {
  setRoutes: Dispatch<SetStateAction<never[]>>
  setConditions: Dispatch<SetStateAction<never[]>>
  setCurrentNode: Dispatch<SetStateAction<Node | null>>
}): React.ReactNode {
  const { setEdges, setNodes } = useReactFlow()

  const [input, setInput] = useState<string>('')
  const [text, setText] = useState<string>('开始查询')
  const [error, setError] = useState<boolean>(false)
  const handleClick: () => Promise<void> = async () => {
    if (input.trim().length === 0) return
    setText('查询中...')
    setError(false)

    setRoutes([])
    setConditions([])
    setNodes([])
    setEdges([])
    setCurrentNode(null)

    // const routes = await window.electronAPI.openFile()
    const routes = await window.electronAPI.onFindRoutes(input)
    if (routes === null) {
      setError(true)
    } else {
      // const svg = await getChemicalSVG(smiles);
      // if (svg !== null) {
      //   const svgUrl = `data:image/svg+xml,${encodeURIComponent(svg)}`;
      //   let node = {
      //     id: "target_0",
      //     type: "chemNode",
      //     data: {
      //       imgUrl: svgUrl,
      //       isLeaf: false,
      //       isTarget: true,
      //       smiles: smiles,
      //     },
      //     position: { x: 300, y: 70 },
      //   };
      //   setCurrentNode(node);
      //   setNodes([node]);
      //   setEdges([]);
      //   setRoutes(routes);
      // }
      console.log(routes)
    }
    setText('开始查询')
  }

  return (
    <Flex
      direction="row"
      justify="center"
      gap="2"
      align="center"
      p="2"
      width="50%"
    >
      <InputGroup>
        <InputLeftElement pointerEvents="none" p="2">
          <MagnifyingGlassIcon />
        </InputLeftElement>
        <Input
          type="text"
          placeholder="仅支持SMILES来查询"
          value={input}
          onChange={(e) => {
            setInput(e.target.value)
            setError(false)
          }}
        />
      </InputGroup>
      {error && (
        <Text size="2" color="red">
          无法获取路线:( 可以再次尝试
        </Text>
      )}
      <Button onClick={handleClick} color="gray.500">
        {text}
      </Button>
      <ChemEditor setInput={setInput} />
    </Flex>
  )
}
