import { Box } from '@chakra-ui/react'
import Header from './Header'
import Sidebar from './Sidebar'

const Layout = ({ children }) => {
  return (
    <Box minH="100vh" bg="gray.50">
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
