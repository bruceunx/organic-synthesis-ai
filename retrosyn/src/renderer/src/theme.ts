import { extendBaseTheme } from '@chakra-ui/react'

export const theme = extendBaseTheme({
  components: {
    Link: {
      textDecoration: 'none',
      _hover: {
        textDecoration: 'none',
      },
    },
  },
})
