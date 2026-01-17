import { Box, useColorModeValue } from '@chakra-ui/react'
import Header from './Header'
import Sidebar from './Sidebar'

const Layout = ({ children }) => {
  const bg = useColorModeValue('gray.50', 'gray.900')
  
  return (
    <Box minH="100vh" bg={bg}>
      <Header />
      <Box display="flex">
        <Sidebar />
        <Box flex="1" p={6} ml={{ base: 0, md: '250px' }} mt="64px">
          {children}
        </Box>
      </Box>
    </Box>
  )
}

export default Layout
