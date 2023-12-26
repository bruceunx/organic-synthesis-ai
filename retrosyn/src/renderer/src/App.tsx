import { ChakraProvider } from '@chakra-ui/react'
import Routes from './route'

function App(): JSX.Element {
  return (
    <ChakraProvider>
      <Routes />
    </ChakraProvider>
  )
}

export default App
