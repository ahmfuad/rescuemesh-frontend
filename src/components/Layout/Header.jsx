import {
  Box,
  Flex,
  Heading,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Badge,
  useColorModeValue,
  Avatar,
  Text,
  useToast,
} from '@chakra-ui/react'
import { FiBell, FiUser, FiSettings, FiLogOut } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

const Header = () => {
  const navigate = useNavigate()
  const toast = useToast()
  const bg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const [user, setUser] = useState(null)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    toast({
      title: 'Logged out successfully',
      status: 'info',
      duration: 3000,
      isClosable: true,
    })
    navigate('/login')
  }

  return (
    <Box
      as="header"
      position="fixed"
      top={0}
      left={0}
      right={0}
      zIndex={1000}
      bg={bg}
      borderBottom="1px"
      borderColor={borderColor}
      px={6}
      py={3}
      backdropFilter="blur(10px)"
      boxShadow="sm"
    >
      <Flex justify="space-between" align="center">
        <HStack spacing={4}>
          <Heading
            size="lg"
            bgGradient="linear(to-r, brand.400, cosmic.400)"
            bgClip="text"
            cursor="pointer"
            onClick={() => navigate('/dashboard')}
          >
            🚨 RescueMesh
          </Heading>
          <Badge colorScheme="green" fontSize="0.8em">
            LIVE
          </Badge>
        </HStack>

        <HStack spacing={4}>
          <IconButton
            icon={<FiBell />}
            variant="ghost"
            aria-label="Notifications"
            position="relative"
            onClick={() => navigate('/notifications')}
          >
            <Box
              position="absolute"
              top="8px"
              right="8px"
              w="8px"
              h="8px"
              bg="red.500"
              borderRadius="full"
            />
          </IconButton>

          <Menu>
            <MenuButton>
              <HStack>
                <Avatar size="sm" name={user?.name || 'User'} bg="brand.500" />
                <Text fontSize="sm" display={{ base: 'none', md: 'block' }}>
                  {user?.name || 'User'}
                </Text>
              </HStack>
            </MenuButton>
            <MenuList>
              <MenuItem icon={<FiUser />} onClick={() => navigate('/profile')}>
                Profile
              </MenuItem>
              <MenuItem icon={<FiSettings />}>Settings</MenuItem>
              <MenuItem icon={<FiLogOut />} onClick={handleLogout}>
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Flex>
    </Box>
  )
}

export default Header
