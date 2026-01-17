import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
  colors: {
    brand: {
      50: '#e6f3ff',
      100: '#b3d9ff',
      200: '#80bfff',
      300: '#4da6ff',
      400: '#1a8cff',
      500: '#0073e6',
      600: '#005bb3',
      700: '#004380',
      800: '#002b4d',
      900: '#00131a',
    },
    space: {
      50: '#f0f4ff',
      100: '#d9e2ff',
      200: '#a6c1ff',
      300: '#598bff',
      400: '#3366ff',
      500: '#1a47ff',
      600: '#0029cc',
      700: '#001f99',
      800: '#001466',
      900: '#000a33',
    },
    cosmic: {
      50: '#fff0f5',
      100: '#ffd6e8',
      200: '#ffadd2',
      300: '#ff85bd',
      400: '#ff5ca8',
      500: '#ff3385',
      600: '#cc0052',
      700: '#99003d',
      800: '#660029',
      900: '#330014',
    },
  },
  fonts: {
    heading: `'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`,
    body: `'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`,
  },
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
  styles: {
    global: (props) => ({
      body: {
        bg: props.colorMode === 'dark' ? 'gray.900' : 'gray.50',
        color: props.colorMode === 'dark' ? 'gray.100' : 'gray.900',
      },
      '*': {
        borderColor: props.colorMode === 'dark' ? 'gray.700' : 'gray.200',
      },
    }),
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: 'brand',
      },
      variants: {
        solid: (props) => ({
          bg: props.colorScheme === 'brand' ? 'brand.500' : undefined,
          _hover: {
            bg: props.colorScheme === 'brand' ? 'brand.600' : undefined,
            transform: 'translateY(-2px)',
            boxShadow: 'lg',
          },
          transition: 'all 0.2s',
        }),
      },
    },
    Card: {
      baseStyle: (props) => ({
        container: {
          bg: props.colorMode === 'dark' ? 'gray.800' : 'white',
          borderRadius: 'lg',
          boxShadow: props.colorMode === 'dark' ? 'dark-lg' : 'md',
          border: '1px solid',
          borderColor: props.colorMode === 'dark' ? 'gray.700' : 'gray.200',
        },
      }),
    },
  },
})

export default theme
