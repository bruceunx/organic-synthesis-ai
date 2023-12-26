import { ButtonGroup, Button } from '@chakra-ui/react'

const HomePage: React.FC = () => {
  return (
    <>
      <ButtonGroup
        variant="outline"
        spacing="6"
        justifyContent="center"
        height="10%"
        py={3}
      >
        <Button colorScheme="blue">开始采集</Button>
        <Button>停止采集</Button>
      </ButtonGroup>
    </>
  )
}

export default HomePage
