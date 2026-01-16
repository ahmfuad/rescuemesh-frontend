import { useEffect, useState } from 'react'
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
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  useToast,
  Spinner,
  Alert,
  AlertIcon,
} from '@chakra-ui/react'
import { FiPlus, FiMapPin } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { disasterService } from '../services/api'
import { DISASTER_TYPES, SEVERITY_LEVELS } from '../utils/constants'
import { format } from 'date-fns'

const Disasters = () => {
  const [disasters, setDisasters] = useState([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    disasterType: 'flood',
    severity: 'medium',
    latitude: '',
    longitude: '',
    address: '',
    description: '',
  })
  const { isOpen, onOpen, onClose } = useDisclosure()
  const navigate = useNavigate()
  const toast = useToast()

  useEffect(() => {
    fetchDisasters()
  }, [])

  const fetchDisasters = async () => {
    try {
      setLoading(true)
      const response = await disasterService.getActive()
      setDisasters(response.data.disasters || response.data || [])
    } catch (error) {
      console.error('Failed to fetch disasters:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch disasters',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await disasterService.create({
        ...formData,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        reportedBy: 'current-user', // Replace with actual user ID
      })
      toast({
        title: 'Success',
        description: 'Disaster reported successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
      onClose()
      fetchDisasters()
      setFormData({
        disasterType: 'flood',
        severity: 'medium',
        latitude: '',
        longitude: '',
        address: '',
        description: '',
      })
    } catch (error) {
      console.error('Failed to create disaster:', error)
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to report disaster',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
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
      <HStack justify="space-between" mb={6}>
        <Heading>Active Disasters</Heading>
        <Button leftIcon={<FiPlus />} colorScheme="red" onClick={onOpen}>
          Report Disaster
        </Button>
      </HStack>

      {disasters.length === 0 ? (
        <Alert status="info">
          <AlertIcon />
          No active disasters found
        </Alert>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {disasters.map((disaster) => (
            <Card
              key={disaster.disasterId}
              cursor="pointer"
              _hover={{ shadow: 'lg', transform: 'translateY(-2px)' }}
              transition="all 0.2s"
              onClick={() => navigate(`/disasters/${disaster.disasterId}`)}
            >
              <CardBody>
                <VStack align="stretch" spacing={3}>
                  <HStack justify="space-between">
                    <Text fontSize="3xl">
                      {DISASTER_TYPES[disaster.disasterType]?.icon || '⚠️'}
                    </Text>
                    <Badge
                      colorScheme={SEVERITY_LEVELS[disaster.severity]?.color || 'gray'}
                      fontSize="0.9em"
                    >
                      {disaster.severity?.toUpperCase()}
                    </Badge>
                  </HStack>

                  <Box>
                    <Text fontWeight="bold" fontSize="lg">
                      {DISASTER_TYPES[disaster.disasterType]?.label || disaster.disasterType}
                    </Text>
                    <HStack color="gray.600" fontSize="sm" mt={1}>
                      <FiMapPin />
                      <Text>{disaster.location?.address || 'Unknown location'}</Text>
                    </HStack>
                  </Box>

                  {disaster.description && (
                    <Text fontSize="sm" color="gray.600" noOfLines={2}>
                      {disaster.description}
                    </Text>
                  )}

                  <Text fontSize="xs" color="gray.500">
                    Reported: {disaster.reportedAt ? format(new Date(disaster.reportedAt), 'PPp') : 'Unknown'}
                  </Text>

                  {disaster.affectedArea && (
                    <Text fontSize="sm">
                      Affected Area: <strong>{disaster.affectedArea} km²</strong>
                    </Text>
                  )}
                </VStack>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
      )}

      {/* Create Disaster Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleSubmit}>
            <ModalHeader>Report New Disaster</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Disaster Type</FormLabel>
                  <Select
                    value={formData.disasterType}
                    onChange={(e) =>
                      setFormData({ ...formData, disasterType: e.target.value })
                    }
                  >
                    {Object.entries(DISASTER_TYPES).map(([key, value]) => (
                      <option key={key} value={key}>
                        {value.icon} {value.label}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Severity</FormLabel>
                  <Select
                    value={formData.severity}
                    onChange={(e) =>
                      setFormData({ ...formData, severity: e.target.value })
                    }
                  >
                    {Object.entries(SEVERITY_LEVELS).map(([key, value]) => (
                      <option key={key} value={key}>
                        {value.label}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <SimpleGrid columns={2} spacing={4} w="full">
                  <FormControl isRequired>
                    <FormLabel>Latitude</FormLabel>
                    <Input
                      type="number"
                      step="any"
                      placeholder="28.6139"
                      value={formData.latitude}
                      onChange={(e) =>
                        setFormData({ ...formData, latitude: e.target.value })
                      }
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Longitude</FormLabel>
                    <Input
                      type="number"
                      step="any"
                      placeholder="77.2090"
                      value={formData.longitude}
                      onChange={(e) =>
                        setFormData({ ...formData, longitude: e.target.value })
                      }
                    />
                  </FormControl>
                </SimpleGrid>

                <FormControl isRequired>
                  <FormLabel>Address</FormLabel>
                  <Input
                    placeholder="City, Country"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    placeholder="Additional details about the disaster..."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </FormControl>
              </VStack>
            </ModalBody>

            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" colorScheme="red">
                Report Disaster
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export default Disasters
