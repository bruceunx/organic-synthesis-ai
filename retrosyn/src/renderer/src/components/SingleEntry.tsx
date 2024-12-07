import { Button, Image, Td, Tr } from '@chakra-ui/react'
import { DataItem } from '@renderer/types'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

interface props {
  entry: DataItem
  onDelete: (id: number) => void
}

const SingleEntry: React.FC<props> = ({ onDelete, entry }) => {
  const [img, setImg] = useState<string | null>(null)

  useEffect(() => {
    const initImg = async (smiles: string) => {
      const res = await window.electronAPI.onGetSvg(smiles)
      if (res !== null) {
        const svgUrl = `data:image/svg+xml,${encodeURIComponent(res)}`
        setImg(svgUrl)
      }
    }
    initImg(entry.target)
  }, [entry])

  return (
    <Tr>
      <Td>{entry.id}</Td>
      <Td>{entry.time_stamp}</Td>
      <Td width="20%">
        <Link to={`/history/${entry.id}`}>
          {img && (
            <Image
              src={img}
              alt="target"
              htmlWidth={70}
              htmlHeight={70}
              bgColor="gray.200"
              borderRadius={12}
              _hover={{ bgColor: 'yellow.200' }}
            />
          )}
        </Link>
      </Td>
      <Td>
        <Button
          onClick={() => onDelete(entry.id)}
          color="white"
          bgColor="red.400"
          _hover={{ bgColor: 'red.700' }}
        >
          删除
        </Button>
      </Td>
    </Tr>
  )
}

export default SingleEntry
