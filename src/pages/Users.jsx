import { useEffect, useState } from 'react'
import {
  Box,
  Heading,
  Card,
  CardBody,
  Text,
  Badge,
  SimpleGrid,
  HStack,
  VStack,
  Avatar,
  useToast,
  Spinner,
  Input,
  Select,
  Alert,
  AlertIcon,
} from '@chakra-ui/react'
import { FiMapPin, FiStar } from 'react-icons/fi'
import { userService } from '../services/api'
import { USER_ROLES } from '../utils/constants'

const Users = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const toast = useToast()

  // Mock data for demonstration
  const mockUsers = [
    {
      userId: 'user-001',
      role: 'volunteer',
      profile: { name: 'Rajesh Kumar', phone: '+91-9876543210', email: 'rajesh@example.com' },
      location: { latitude: 28.6139, longitude: 77.2090, address: 'New Delhi, India' },
      status: 'active',
      trustScore: 8.5,
    },
    {
      userId: 'user-002',
      role: 'volunteer',
      profile: { name: 'Priya Sharma', phone: '+91-9876543211', email: 'priya@example.com' },
      location: { latitude: 28.6200, longitude: 77.2100, address: 'New Delhi, India' },
      status: 'active',
      trustScore: 9.2,
    },
    {
      userId: 'user-003',
      role: 'authority',
      profile: { name: 'Dr. Singh', phone: '+91-9876543212', email: 'singh@gov.in' },
      location: { latitude: 28.6150, longitude: 77.2050, address: 'New Delhi, India' },
      status: 'active',
      trustScore: 9.8,
    },
  ]

  useEffect(() => {
    setUsers(mockUsers)
  }, [])

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.profile.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    return matchesSearch && matchesRole
  })

  return (
    <Box>
      <Heading mb={6}>Users & Volunteers</Heading>

      <Card mb={6}>
        <CardBody>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            <Input
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
              <option value="all">All Roles</option>
              {Object.entries(USER_ROLES).map(([key, value]) => (
                <option key={key} value={key}>
                  {value.label}
                </option>
              ))}
            </Select>
          </SimpleGrid>
        </CardBody>
      </Card>

      {filteredUsers.length === 0 ? (
        <Alert status="info">
          <AlertIcon />
          No users found
        </Alert>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {filteredUsers.map((user) => (
            <Card key={user.userId}>
              <CardBody>
                <VStack align="stretch" spacing={4}>
                  <HStack>
                    <Avatar name={user.profile.name} bg="brand.500" />
                    <Box flex="1">
                      <Text fontWeight="bold">{user.profile.name}</Text>
                      <Badge colorScheme={USER_ROLES[user.role]?.color || 'gray'}>
                        {USER_ROLES[user.role]?.label || user.role}
                      </Badge>
                    </Box>
                  </HStack>

                  <VStack align="stretch" spacing={2}>
                    <HStack fontSize="sm" color="gray.600">
                      <FiMapPin />
                      <Text>{user.location?.address || 'Unknown'}</Text>
                    </HStack>

                    <HStack fontSize="sm">
                      <FiStar color="gold" />
                      <Text>Trust Score: {user.trustScore}/10</Text>
                    </HStack>

                    <Text fontSize="sm" color="gray.600">
                      Phone: {user.profile.phone}
                    </Text>

                    <Badge
                      colorScheme={user.status === 'active' ? 'green' : 'gray'}
                      alignSelf="start"
                    >
                      {user.status?.toUpperCase()}
                    </Badge>
                  </VStack>
                </VStack>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
      )}
    </Box>
  )
}

export default Users
