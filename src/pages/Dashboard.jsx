import { useEffect, useState } from 'react'
import {
  Box,
  Grid,
  Heading,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Card,
  CardHeader,
  CardBody,
  SimpleGrid,
  Text,
  Badge,
  HStack,
  VStack,
  Button,
  useToast,
  Spinner,
  Alert,
  AlertIcon,
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { FiAlertTriangle, FiUsers, FiTool, FiAlertCircle } from 'react-icons/fi'
import { disasterService, sosService, skillService } from '../services/api'
import { DISASTER_TYPES, SEVERITY_LEVELS } from '../utils/constants'
import { format } from 'date-fns'

const Dashboard = () => {
  const [loading, setLoading] = useState(true)
  const [disasters, setDisasters] = useState([])
  const [stats, setStats] = useState({
    activeDisasters: 0,
    sosRequests: 0,
    availableVolunteers: 0,
    resources: 0,
  })
  const navigate = useNavigate()
  const toast = useToast()

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const [disastersRes, sosRes, skillsRes] = await Promise.all([
        disasterService.getActive(),
        sosService.getAll({ status: 'pending' }),
        skillService.search({ available: true }),
      ])

      setDisasters(disastersRes.data.disasters || disastersRes.data || [])
      setStats({
        activeDisasters: disastersRes.data.disasters?.length || disastersRes.data?.length || 0,
        sosRequests: sosRes.data.requests?.length || 0,
        availableVolunteers: skillsRes.data.skills?.length || 0,
        resources: 0,
      })
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
      toast({
        title: 'Error loading dashboard',
        description: error.response?.data?.message || 'Failed to fetch data',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" h="400px">
        <Spinner size="xl" color="brand.500" />
      </Box>
    )
  }

  return (
    <Box>
      <Heading mb={6}>Dashboard</Heading>

      {/* Stats Cards */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>
                <HStack>
                  <FiAlertTriangle />
                  <Text>Active Disasters</Text>
                </HStack>
              </StatLabel>
              <StatNumber color="red.500">{stats.activeDisasters}</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                Requires immediate attention
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel>
                <HStack>
                  <FiAlertCircle />
                  <Text>SOS Requests</Text>
                </HStack>
              </StatLabel>
              <StatNumber color="orange.500">{stats.sosRequests}</StatNumber>
              <StatHelpText>Pending assignments</StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel>
                <HStack>
                  <FiUsers />
                  <Text>Available Volunteers</Text>
                </HStack>
              </StatLabel>
              <StatNumber color="green.500">{stats.availableVolunteers}</StatNumber>
              <StatHelpText>Ready to respond</StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel>
                <HStack>
                  <FiTool />
                  <Text>Resources</Text>
                </HStack>
              </StatLabel>
              <StatNumber color="blue.500">{stats.resources}</StatNumber>
              <StatHelpText>Available equipment</StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Active Disasters */}
      <Card>
        <CardHeader>
          <HStack justify="space-between">
            <Heading size="md">Active Disasters</Heading>
            <Button
              size="sm"
              colorScheme="brand"
              onClick={() => navigate('/disasters')}
            >
              View All
            </Button>
          </HStack>
        </CardHeader>
        <CardBody>
          {disasters.length === 0 ? (
            <Alert status="info">
              <AlertIcon />
              No active disasters at the moment
            </Alert>
          ) : (
            <VStack spacing={4} align="stretch">
              {disasters.slice(0, 5).map((disaster) => (
                <Box
                  key={disaster.disasterId}
                  p={4}
                  borderWidth="1px"
                  borderRadius="lg"
                  cursor="pointer"
                  _hover={{ bg: 'gray.50' }}
                  onClick={() => navigate(`/disasters/${disaster.disasterId}`)}
                >
                  <HStack justify="space-between" mb={2}>
                    <HStack>
                      <Text fontSize="2xl">
                        {DISASTER_TYPES[disaster.disasterType]?.icon || '⚠️'}
                      </Text>
                      <VStack align="start" spacing={0}>
                        <Text fontWeight="bold">
                          {DISASTER_TYPES[disaster.disasterType]?.label || disaster.disasterType}
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                          {disaster.location?.address || 'Unknown location'}
                        </Text>
                      </VStack>
                    </HStack>
                    <Badge
                      colorScheme={SEVERITY_LEVELS[disaster.severity]?.color || 'gray'}
                      fontSize="0.8em"
                    >
                      {disaster.severity?.toUpperCase()}
                    </Badge>
                  </HStack>
                  <Text fontSize="sm" color="gray.500">
                    Reported: {disaster.reportedAt ? format(new Date(disaster.reportedAt), 'PPp') : 'Unknown'}
                  </Text>
                </Box>
              ))}
            </VStack>
          )}
        </CardBody>
      </Card>
    </Box>
  )
}

export default Dashboard
