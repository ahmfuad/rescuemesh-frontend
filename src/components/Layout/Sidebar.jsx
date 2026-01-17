import { 
  Box, 
  VStack, 
  Link as ChakraLink, 
  Icon, 
  Text, 
  useColorModeValue,
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  IconButton
} from '@chakra-ui/react'
import { NavLink } from 'react-router-dom'
import {
  FiHome,
  FiAlertTriangle,
  FiUsers,
  FiTool,
  FiAlertCircle,
  FiTarget,
  FiBell,
  FiMenu,
} from 'react-icons/fi'
import { useEffect } from 'react'

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: FiHome },
  { path: '/disasters', label: 'Disasters', icon: FiAlertTriangle },
  { path: '/users', label: 'Users', icon: FiUsers },
  { path: '/skills', label: 'Skills & Resources', icon: FiTool },
  { path: '/sos', label: 'SOS Requests', icon: FiAlertCircle },
  { path: '/matching', label: 'Matching', icon: FiTarget },
  { path: '/notifications', label: 'Notifications', icon: FiBell },
]

const Sidebar = () => {
  const bg = useColorModeValue('white', 'gray.800')
  const activeBg = useColorModeValue('brand.50', 'brand.900')
  const hoverBg = useColorModeValue('gray.100', 'gray.700')
  const { isOpen, onOpen, onClose } = useDisclosure()

  const SidebarContent = ({ onItemClick }) => (
    <VStack spacing={1} align="stretch" p={4}>
      {navItems.map((item) => (
        <ChakraLink
          as={NavLink}
          key={item.path}
          to={item.path}
          onClick={onItemClick}
          _hover={{ textDecoration: 'none', bg: hoverBg }}
          _activeLink={{ bg: activeBg, color: 'brand.400', fontWeight: 'semibold' }}
          borderRadius="md"
          px={4}
          py={3}
          display="flex"
          alignItems="center"
          transition="all 0.2s"
        >
          <Icon as={item.icon} mr={3} />
          <Text>{item.label}</Text>
        </ChakraLink>
      ))}
    </VStack>
  )

  return (
    <>
      {/* Mobile menu button */}
      <IconButton
        icon={<FiMenu />}
        aria-label="Open menu"
        onClick={onOpen}
        display={{ base: 'flex', md: 'none' }}
        position="fixed"
        left={4}
        top={4}
        zIndex={1001}
        size="md"
        variant="ghost"
      />

      {/* Mobile drawer */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent bg={bg}>
          <DrawerCloseButton />
          <DrawerBody p={0} mt={12}>
            <SidebarContent onItemClick={onClose} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Desktop sidebar */}
      <Box
        as="nav"
        position="fixed"
        left={0}
        top="64px"
        bottom={0}
        w="250px"
        bg={bg}
        borderRight="1px"
        borderColor={useColorModeValue('gray.200', 'gray.700')}
        display={{ base: 'none', md: 'block' }}
        overflowY="auto"
      >
        <SidebarContent onItemClick={() => {}} />
      </Box>
    </>
  )
}

export default Sidebar
