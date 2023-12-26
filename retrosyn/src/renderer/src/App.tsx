import { ChakraProvider } from '@chakra-ui/react'
import Routes from './route'

import { theme } from './theme'

function App(): JSX.Element {
  return (
    <ChakraProvider theme={theme}>
      <Routes />
    </ChakraProvider>
  )
}

export default App
