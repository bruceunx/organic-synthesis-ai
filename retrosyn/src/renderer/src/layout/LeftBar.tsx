import React from 'react'

import { Box, HStack, Icon, VStack, Text, Flex } from '@chakra-ui/react'
import { MdSettings, MdSearch, MdMonitor } from 'react-icons/md'
import { useLocation, Link } from 'react-router-dom'

interface leftbarOpts {
  toggle: boolean
}

const LeftBar: React.FC<leftbarOpts> = ({ toggle }) => {
  const location = useLocation()

  return (
    <Box
      display="flex"
      flexDir="column"
      position="fixed"
      top={0}
      left={0}
      h="100vh"
      w={`${toggle ? '170px' : '55px'}`}
      py={3}
      px={1}
      bg="#4c515a"
      color="lightgray"
      boxShadow="md"
      justifyContent="space-between"
    >
      <Flex
        justifyContent="start"
        alignItems="start"
        direction="column"
        width="100%"
      >
        <Link to="/" style={{ width: '100%' }}>
          <HStack
            _hover={{
              bgColor: 'gray.600',
              cursor: 'pointer',
            }}
            bgColor={`${location.pathname === '/' ? 'blue.500' : ''}`}
          >
            <Icon as={MdMonitor} boxSize={50} p={2} />
            {toggle && <Text fontSize="20">合成查询</Text>}
          </HStack>
        </Link>
        <Link to="/history" style={{ width: '100%' }}>
          <HStack
            _hover={{
              bgColor: 'gray.600',
              cursor: 'pointer',
            }}
            bgColor={`${location.pathname === '/history' ? 'blue.500' : ''}`}
          >
            <Icon as={MdSearch} boxSize={50} borderRadius="lg" p={2} />
            {toggle && <Text fontSize="20">历史查询</Text>}
          </HStack>
        </Link>
        <Link to="/helper" style={{ width: '100%' }}>
          <HStack
            _hover={{
              bgColor: 'gray.600',
              cursor: 'pointer',
            }}
            bgColor={`${location.pathname === '/helper' ? 'blue.500' : ''}`}
          >
            <Icon as={MdSettings} boxSize={50} borderRadius="lg" p={2} />
            {toggle && <Text fontSize="20">帮助说明</Text>}
          </HStack>
        </Link>
      </Flex>

      <VStack mb={0}>
        {toggle && (
          <Text align="center" color="blue.200">
            pylogic.net
          </Text>
        )}
      </VStack>
    </Box>
  )
}

export default LeftBar
