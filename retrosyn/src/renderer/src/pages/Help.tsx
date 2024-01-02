import { Flex, Heading, Link, Text } from '@chakra-ui/react'

const Help: React.FC = () => {
  return (
    <Flex
      direction="column"
      width="100%"
      height="100%"
      justify="start"
      align="center"
    >
      <Heading>帮助说明</Heading>
      <Text>
        <Link href="https://aichem.pylogic.net" target="_blank">
          在线使用 aichem.pylogic.net
        </Link>
      </Text>
    </Flex>
  )
}

export default Help
