import {
  Button,
  ButtonGroup,
  Flex,
  HStack,
  Input,
  List,
  ListItem,
  Checkbox,
} from '@chakra-ui/react'

const Setting: React.FC = () => {
  return (
    <Flex
      direction="column"
      width="100%"
      height="100%"
      justify="start"
      align="center"
    >
      <HStack height="10%" width="100%" justify="center" pt={2}>
        <label style={{ width: 'auto' }}>添加配置</label>
        <Input type="text" width="100" />
        <ButtonGroup>
          <Button>添加</Button>
          <Button>删除</Button>
        </ButtonGroup>
      </HStack>
      <List spacing={3} pt={7}>
        <ListItem>
          <Checkbox size="sm" colorScheme="red" mr={2}>
            选择
          </Checkbox>
          IP 192.168.1.10 LF
        </ListItem>
        <ListItem>
          <Checkbox size="sm" colorScheme="red" mr={2}>
            选择
          </Checkbox>
          IP 192.168.1.20 LF
        </ListItem>
      </List>
    </Flex>
  )
}

export default Setting
