import { Radio, Tr, Td, Image } from '@chakra-ui/react'
import { useEffect, useState } from 'react'

type conditionProps = {
  condition: {
    reagent: string
    solvent: string
    catalyst: string
    temperature: number
    score: number
  }
  idx: number
}

const Condition: React.FC<conditionProps> = ({ condition, idx }) => {
  const [reagent, setReagent] = useState<string | null>(null)
  const [solvent, setSolvent] = useState<string | null>(null)
  const [catalyst, setCatalyst] = useState<string | null>(null)

  useEffect(() => {
    const updateSvg = async () => {
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
    }
    updateSvg()
    // eslint-disable-next-line
  }, [])

  return (
    <Tr>
      <Td width="10%">{condition.score.toFixed(2)}</Td>
      <Td width="20%">
        {reagent && (
          <Image
            src={reagent}
            alt="reagent"
            htmlWidth={200}
            htmlHeight={200}
            bgColor="blue.200"
            borderRadius={12}
          />
        )}
      </Td>
      <Td width="20%">
        {solvent && (
          <Image
            src={solvent}
            alt="solvent"
            htmlWidth={200}
            htmlHeight={200}
            bgColor="gray.200"
            borderRadius={12}
          />
        )}
      </Td>
      <Td width="20%">
        {catalyst && (
          <Image
            src={catalyst}
            alt="catalyst"
            htmlWidth={200}
            htmlHeight={200}
            bgColor="green.200"
            borderRadius={12}
          />
        )}
      </Td>
      <Td width="10%">{condition.temperature.toFixed(1)}</Td>
      <Td width="10%">
        <Radio value={idx.toString()} />
      </Td>
    </Tr>
  )
}

export default Condition
