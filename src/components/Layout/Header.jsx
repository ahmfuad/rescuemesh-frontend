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
} from '@chakra-ui/react'
import { FiBell, FiUser, FiSettings, FiLogOut } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

const Header = () => {
  const navigate = useNavigate()
  const bg = useColorModeValue('white', 'gray.800')

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
      borderColor="gray.200"
      px={6}
      py={3}
    >
      <Flex justify="space-between" align="center">
        <HStack spacing={4}>
          <Heading
            size="lg"
            bgGradient="linear(to-r, brand.500, brand.700)"
            bgClip="text"
            cursor="pointer"
            onClick={() => navigate('/')}
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
              <Avatar size="sm" name="User" bg="brand.500" />
            </MenuButton>
            <MenuList>
              <MenuItem icon={<FiUser />}>Profile</MenuItem>
              <MenuItem icon={<FiSettings />}>Settings</MenuItem>
              <MenuItem icon={<FiLogOut />}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Flex>
    </Box>
  )
}

export default Header
