import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box,
  Heading,
  Button,
  HStack,
  VStack,
  Card,
  CardBody,
  Text,
  Badge,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  useToast,
  Spinner,
  Alert,
  AlertIcon,
  Divider,
} from '@chakra-ui/react'
import { FiArrowLeft, FiMapPin, FiClock, FiAlertTriangle } from 'react-icons/fi'
import { disasterService, skillService } from '../services/api'
import { DISASTER_TYPES, SEVERITY_LEVELS } from '../utils/constants'
import { format } from 'date-fns'

const DisasterDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const [disaster, setDisaster] = useState(null)
  const [template, setTemplate] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDisasterDetails()
  }, [id])

  const fetchDisasterDetails = async () => {
    try {
      setLoading(true)
      const response = await disasterService.getById(id)
      const disasterData = response.data
      setDisaster(disasterData)

      // Fetch disaster template if disaster type is available
      if (disasterData.disasterType) {
        try {
          const templateRes = await skillService.getTemplate(disasterData.disasterType)
          setTemplate(templateRes.data)
        } catch (error) {
          console.error('Failed to fetch template:', error)
        }
      }
    } catch (error) {
      console.error('Failed to fetch disaster details:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch disaster details',
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

  if (!disaster) {
    return (
      <Box>
        <Alert status="error">
          <AlertIcon />
          Disaster not found
        </Alert>
        <Button mt={4} leftIcon={<FiArrowLeft />} onClick={() => navigate('/disasters')}>
          Back to Disasters
        </Button>
      </Box>
    )
  }

  return (
    <Box>
      <Button
        leftIcon={<FiArrowLeft />}
        variant="ghost"
        mb={4}
        onClick={() => navigate('/disasters')}
      >
        Back to Disasters
      </Button>

      <Card mb={6}>
        <CardBody>
          <HStack justify="space-between" mb={4}>
            <HStack spacing={4}>
              <Text fontSize="5xl">
                {DISASTER_TYPES[disaster.disasterType]?.icon || '⚠️'}
              </Text>
              <Box>
                <Heading size="lg">
                  {DISASTER_TYPES[disaster.disasterType]?.label || disaster.disasterType}
                </Heading>
                <HStack color="gray.600" mt={1}>
                  <FiMapPin />
                  <Text>{disaster.location?.address || 'Unknown location'}</Text>
                </HStack>
              </Box>
            </HStack>
            <Badge
              colorScheme={SEVERITY_LEVELS[disaster.severity]?.color || 'gray'}
              fontSize="1em"
              px={4}
              py={2}
            >
              {disaster.severity?.toUpperCase()}
            </Badge>
          </HStack>

          <Divider my={4} />

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={4}>
            <Stat>
              <StatLabel>
                <HStack>
                  <FiClock />
                  <Text>Reported At</Text>
                </HStack>
              </StatLabel>
              <StatNumber fontSize="md">
                {disaster.reportedAt ? format(new Date(disaster.reportedAt), 'PPp') : 'Unknown'}
              </StatNumber>
            </Stat>

            <Stat>
              <StatLabel>Status</StatLabel>
              <StatNumber fontSize="md">
                <Badge colorScheme={disaster.status === 'active' ? 'red' : 'gray'}>
                  {disaster.status?.toUpperCase()}
                </Badge>
              </StatNumber>
            </Stat>

            {disaster.affectedArea && (
              <Stat>
                <StatLabel>Affected Area</StatLabel>
                <StatNumber fontSize="md">{disaster.affectedArea} km²</StatNumber>
              </Stat>
            )}
          </SimpleGrid>

          {disaster.description && (
            <>
              <Divider my={4} />
              <Box>
                <Text fontWeight="bold" mb={2}>
                  Description
                </Text>
                <Text color="gray.600">{disaster.description}</Text>
              </Box>
            </>
          )}

          <Divider my={4} />

          <Box>
            <Text fontWeight="bold" mb={2}>
              Location Coordinates
            </Text>
            <HStack>
              <Text color="gray.600">
                Lat: {disaster.location?.latitude?.toFixed(6) || 'N/A'}
              </Text>
              <Text color="gray.600">
                Lng: {disaster.location?.longitude?.toFixed(6) || 'N/A'}
              </Text>
            </HStack>
          </Box>
        </CardBody>
      </Card>

      {/* Required Resources Template */}
      {template && (
        <Card>
          <CardBody>
            <Heading size="md" mb={4}>
              <HStack>
                <FiAlertTriangle />
                <Text>Required Resources & Skills</Text>
              </HStack>
            </Heading>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <Box>
                <Text fontWeight="bold" mb={3}>
                  Required Skills
                </Text>
                <VStack align="stretch" spacing={2}>
                  {template.requiredSkills?.map((skill, index) => (
                    <Badge key={index} colorScheme="blue" p={2}>
                      {skill.replace(/_/g, ' ').toUpperCase()}
                    </Badge>
                  ))}
                </VStack>
              </Box>

              <Box>
                <Text fontWeight="bold" mb={3}>
                  Required Resources
                </Text>
                <VStack align="stretch" spacing={2}>
                  {template.requiredResources?.map((resource, index) => (
                    <Badge key={index} colorScheme="green" p={2}>
                      {resource.replace(/_/g, ' ').toUpperCase()}
                    </Badge>
                  ))}
                </VStack>
              </Box>
            </SimpleGrid>

            {template.estimatedVolunteers && (
              <Box mt={4}>
                <Text color="gray.600">
                  Estimated Volunteers Needed: <strong>{template.estimatedVolunteers}</strong>
                </Text>
              </Box>
            )}
          </CardBody>
        </Card>
      )}
    </Box>
  )
}

export default DisasterDetail
