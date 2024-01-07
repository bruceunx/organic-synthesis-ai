import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'

import { HStack, Heading, Icon } from '@chakra-ui/react'

import { MdAccountBalance, MdReorder } from 'react-icons/md'
import { useLocation } from 'react-router-dom'

interface navProps {
  toggle: boolean
  setToggle: Dispatch<SetStateAction<boolean>>
}

const NavBar: React.FC<navProps> = ({ toggle, setToggle }) => {
  const location = useLocation()
  const [title, setTitle] = useState<string>('合成查询')
  useEffect(() => {
    if (location.pathname === '/') {
      setTitle('合成查询')
    } else if (location.pathname === '/history') {
      setTitle('历史数据')
    } else if (location.pathname.startsWith('/history/')) {
      setTitle('编辑历史数据')
    } else {
      setTitle('帮助说明')
    }
  }, [location])

  return (
    <HStack
      w="100%"
      left={`${toggle ? '170px' : '55px'}`}
      height={20}
      position="fixed"
      top={0}
      py={3}
      bg="#282e34"
      zIndex={10}
      justifyContent="space-between"
      color="lightgray"
    >
      <HStack w={600} h="100%">
        <Icon
          as={MdReorder}
          boxSize={50}
          borderRadius="lg"
          _hover={{ color: 'blue.700', cursor: 'pointer' }}
          onClick={() => {
            setToggle(!toggle)
          }}
          p={2}
        />
        <Icon as={MdAccountBalance} color="blue.600" boxSize={50} />
        <Heading as="h1" size="lg" noOfLines={1}>
          AI 辅助合成 - {title}
        </Heading>
      </HStack>
    </HStack>
  )
}

export default NavBar
