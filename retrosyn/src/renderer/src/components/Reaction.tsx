import { Radio, Tr, Td, Image } from '@chakra-ui/react'
import { useEffect, useState } from 'react'

type reactionProps = {
  reactants: string
  target: string
  plausibility: number
  idx: number
}

const Reaction: React.FC<reactionProps> = ({
  reactants,
  target,
  plausibility,
  idx,
}: reactionProps) => {
  const [svg, setSvg] = useState<string | null>(null)

  useEffect(() => {
    const updateSvg = async () => {
      const res = await window.electronAPI.onGetSvg(reactants, 800, 200)
      if (res === null) {
        console.log('error from svg fetching')
      } else {
        const svgUrl = `data:image/svg+xml,${encodeURIComponent(res)}`
        setSvg(svgUrl)
      }
    }
    updateSvg()
    // eslint-disable-next-line
  }, [])

  return (
    <Tr>
      <Td width="10%">{plausibility.toFixed(2)}</Td>
      <Td width="50%">
        {svg && (
          <Image
            src={svg}
            alt="reactants"
            htmlWidth={800}
            htmlHeight={100}
            bgColor="blue.200"
            borderRadius={12}
          />
        )}
      </Td>
      <Td fontSize={30}>------&#x2192;</Td>
      <Td width="20%">
        <Image
          src={target}
          alt="target"
          htmlWidth={200}
          htmlHeight={200}
          bgColor="blue.200"
          borderRadius={12}
        />
      </Td>
      <Td width="10%">
        <Radio value={idx.toString()} />
      </Td>
    </Tr>
  )
}

export default Reaction
