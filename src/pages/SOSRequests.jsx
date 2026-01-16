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
  Alert,
  AlertIcon,
} from '@chakra-ui/react'
import { FiPlus, FiMapPin, FiAlertCircle } from 'react-icons/fi'
import { sosService } from '../services/api'
import { SOS_URGENCY, SOS_STATUS } from '../utils/constants'
import { format } from 'date-fns'

const SOSRequests = () => {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    disasterId: '',
    urgencyLevel: 'medium',
    requiredSkills: '',
    latitude: '',
    longitude: '',
    description: '',
  })
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()

  // Mock data
  const mockRequests = [
    {
      requestId: 'sos-001',
      userId: 'user-001',
      disasterId: 'disaster-001',
      urgencyLevel: 'critical',
      requiredSkills: ['boat_operation', 'first_aid'],
      location: { latitude: 28.6139, longitude: 77.2090, address: 'Delhi, India' },
      description: 'Person trapped in flooded building',
      status: 'pending',
      createdAt: '2026-01-16T10:00:00Z',
    },
    {
      requestId: 'sos-002',
      userId: 'user-002',
      disasterId: 'disaster-001',
      urgencyLevel: 'high',
      requiredSkills: ['search_rescue'],
      location: { latitude: 28.6200, longitude: 77.2100, address: 'Delhi, India' },
      description: 'Family needs evacuation',
      status: 'assigned',
      createdAt: '2026-01-16T09:30:00Z',
    },
  ]

  useEffect(() => {
    setRequests(mockRequests)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const skills = formData.requiredSkills.split(',').map((s) => s.trim())
      await sosService.create({
        userId: 'current-user',
        disasterId: formData.disasterId,
        urgencyLevel: formData.urgencyLevel,
        requiredSkills: skills,
        location: {
          latitude: parseFloat(formData.latitude),
          longitude: parseFloat(formData.longitude),
        },
        description: formData.description,
      })
      toast({
        title: 'Success',
        description: 'SOS request created successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
      onClose()
      setFormData({
        disasterId: '',
        urgencyLevel: 'medium',
        requiredSkills: '',
        latitude: '',
        longitude: '',
        description: '',
      })
    } catch (error) {
      console.error('Failed to create SOS request:', error)
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to create request',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  return (
    <Box>
      <HStack justify="space-between" mb={6}>
        <Heading>SOS Emergency Requests</Heading>
        <Button leftIcon={<FiPlus />} colorScheme="red" onClick={onOpen}>
          Create SOS Request
        </Button>
      </HStack>

      {requests.length === 0 ? (
        <Alert status="info">
          <AlertIcon />
          No SOS requests found
        </Alert>
      ) : (
        <VStack spacing={4} align="stretch">
          {requests.map((request) => (
            <Card key={request.requestId}>
              <CardBody>
                <HStack justify="space-between" align="start" mb={4}>
                  <VStack align="start" spacing={2} flex="1">
                    <HStack>
                      <FiAlertCircle size={24} />
                      <Heading size="md">Request #{request.requestId}</Heading>
                    </HStack>
                    <HStack spacing={3}>
                      <Badge
                        colorScheme={SOS_URGENCY[request.urgencyLevel]?.color || 'gray'}
                        fontSize="0.9em"
                      >
                        {request.urgencyLevel?.toUpperCase()}
                      </Badge>
                      <Badge
                        colorScheme={SOS_STATUS[request.status]?.color || 'gray'}
                        fontSize="0.9em"
                      >
                        {SOS_STATUS[request.status]?.label || request.status}
                      </Badge>
                    </HStack>
                  </VStack>
                  <Text fontSize="sm" color="gray.500">
                    {format(new Date(request.createdAt), 'PPp')}
                  </Text>
                </HStack>

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <Box>
                    <Text fontWeight="bold" fontSize="sm" mb={1}>
                      Description
                    </Text>
                    <Text color="gray.600">{request.description}</Text>
                  </Box>

                  <Box>
                    <Text fontWeight="bold" fontSize="sm" mb={1}>
                      Location
                    </Text>
                    <HStack color="gray.600">
                      <FiMapPin />
                      <Text>{request.location?.address || 'Unknown'}</Text>
                    </HStack>
                  </Box>

                  <Box>
                    <Text fontWeight="bold" fontSize="sm" mb={1}>
                      Required Skills
                    </Text>
                    <HStack flexWrap="wrap">
                      {request.requiredSkills?.map((skill, idx) => (
                        <Badge key={idx} colorScheme="blue">
                          {skill.replace(/_/g, ' ').toUpperCase()}
                        </Badge>
                      ))}
                    </HStack>
                  </Box>

                  <Box>
                    <Text fontWeight="bold" fontSize="sm" mb={1}>
                      Disaster ID
                    </Text>
                    <Text color="gray.600">{request.disasterId}</Text>
                  </Box>
                </SimpleGrid>
              </CardBody>
            </Card>
          ))}
        </VStack>
      )}

      {/* Create SOS Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleSubmit}>
            <ModalHeader>Create SOS Request</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Disaster ID</FormLabel>
                  <Input
                    placeholder="disaster-001"
                    value={formData.disasterId}
                    onChange={(e) =>
                      setFormData({ ...formData, disasterId: e.target.value })
                    }
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Urgency Level</FormLabel>
                  <Select
                    value={formData.urgencyLevel}
                    onChange={(e) =>
                      setFormData({ ...formData, urgencyLevel: e.target.value })
                    }
                  >
                    {Object.entries(SOS_URGENCY).map(([key, value]) => (
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
                  <FormLabel>Required Skills (comma-separated)</FormLabel>
                  <Input
                    placeholder="boat_operation, first_aid"
                    value={formData.requiredSkills}
                    onChange={(e) =>
                      setFormData({ ...formData, requiredSkills: e.target.value })
                    }
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    placeholder="Describe the emergency situation..."
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
                Create Request
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export default SOSRequests
