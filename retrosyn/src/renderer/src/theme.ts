import { extendTheme } from '@chakra-ui/react'

export const theme = extendTheme({
  styles: {
    gloval: {
      a: {
        _hover: {
          textDecoration: 'none',
        },
      },
    },
  },
  components: {
    Link: {
      baseStyle: {
        textDecoration: 'none',
      },
    },
  },
})
