import { Flex, Heading, Link, Text } from '@chakra-ui/react'

const Help: React.FC = () => {
  return (
    <Flex
      direction="column"
      width="50%"
      height="100%"
      justify="start"
      align="start"
      mx={40}
      gap={3}
      py={5}
    >
      <Heading>帮助说明</Heading>
      <Text>
        <Link href="https://aichem.pylogic.net" target="_blank">
          在线使用 aichem.pylogic.net
        </Link>
      </Text>
      <Text>1. 正常输入Smiles来查询合成路线, 可以画出结构图来查询</Text>
      <Text>2. 可以查询反应路线和反应条件</Text>
      <Text>3. 反应路线图包含化合物节点（显示结构图)， 和反应节点</Text>
      <Text>4. 编辑反应路线可以选择 反应节点， 按Del键来删除部分反应路线</Text>
      <Text>5. 多使用几次，就熟悉了:)</Text>
    </Flex>
  )
}

export default Help
