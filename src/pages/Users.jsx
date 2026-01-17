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
  Center,
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

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      // Get sample users from the database
      const userIds = ['user-001', 'user-002', 'user-003']
      const response = await userService.getBatch(userIds)
      const fetchedUsers = response.data.users || []
      
      // Enrich with profile data
      const enrichedUsers = fetchedUsers.map(user => ({
        ...user,
        profile: {
          name: user.profileName || user.name || 'Unknown User',
          phone: user.phone || 'N/A',
          email: user.email || 'N/A'
        },
        location: user.location || { address: 'Unknown' }
      }))
      
      setUsers(enrichedUsers)
    } catch (error) {
      console.error('Failed to fetch users:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch users',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setLoading(false)
    }
  }

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

      {loading ? (
        <Center py={8}>
          <Spinner size="xl" color="blue.500" />
        </Center>
      ) : filteredUsers.length === 0 ? (
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
