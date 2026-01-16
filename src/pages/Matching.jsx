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
  Avatar,
  Progress,
  useToast,
  Alert,
  AlertIcon,
} from '@chakra-ui/react'
import { FiTarget, FiMapPin, FiClock } from 'react-icons/fi'
import { matchingService } from '../services/api'

const Matching = () => {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(false)
  const toast = useToast()

  // Mock data
  const mockMatches = [
    {
      matchId: 'match-001',
      sosRequestId: 'sos-001',
      volunteerId: 'user-002',
      volunteerName: 'Priya Sharma',
      score: 95.5,
      distance: 2.3,
      skills: ['boat_operation', 'first_aid'],
      availability: true,
      estimatedArrival: '15 minutes',
      matchedAt: '2026-01-16T10:05:00Z',
    },
    {
      matchId: 'match-002',
      sosRequestId: 'sos-001',
      volunteerId: 'user-003',
      volunteerName: 'Amit Patel',
      score: 88.2,
      distance: 5.1,
      skills: ['boat_operation'],
      availability: true,
      estimatedArrival: '25 minutes',
      matchedAt: '2026-01-16T10:05:00Z',
    },
    {
      matchId: 'match-003',
      sosRequestId: 'sos-002',
      volunteerId: 'user-001',
      volunteerName: 'Rajesh Kumar',
      score: 92.0,
      distance: 1.5,
      skills: ['search_rescue', 'first_aid'],
      availability: true,
      estimatedArrival: '10 minutes',
      matchedAt: '2026-01-16T09:35:00Z',
    },
  ]

  useEffect(() => {
    setMatches(mockMatches)
  }, [])

  const getScoreColor = (score) => {
    if (score >= 90) return 'green'
    if (score >= 75) return 'blue'
    if (score >= 60) return 'yellow'
    return 'orange'
  }

  return (
    <Box>
      <Heading mb={6}>Volunteer Matching Results</Heading>

      {matches.length === 0 ? (
        <Alert status="info">
          <AlertIcon />
          No matching results found
        </Alert>
      ) : (
        <VStack spacing={4} align="stretch">
          {matches.map((match) => (
            <Card key={match.matchId}>
              <CardBody>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  <VStack align="start" spacing={3}>
                    <HStack>
                      <Avatar name={match.volunteerName} bg="brand.500" />
                      <Box>
                        <Text fontWeight="bold" fontSize="lg">
                          {match.volunteerName}
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                          Volunteer ID: {match.volunteerId}
                        </Text>
                      </Box>
                    </HStack>

                    <Box w="full">
                      <HStack justify="space-between" mb={2}>
                        <HStack>
                          <FiTarget />
                          <Text fontWeight="bold" fontSize="sm">
                            Match Score
                          </Text>
                        </HStack>
                        <Badge colorScheme={getScoreColor(match.score)} fontSize="0.9em">
                          {match.score.toFixed(1)}%
                        </Badge>
                      </HStack>
                      <Progress
                        value={match.score}
                        colorScheme={getScoreColor(match.score)}
                        size="sm"
                        borderRadius="md"
                      />
                    </Box>

                    <HStack spacing={6}>
                      <VStack align="start" spacing={0}>
                        <HStack fontSize="sm" color="gray.600">
                          <FiMapPin />
                          <Text>Distance</Text>
                        </HStack>
                        <Text fontWeight="bold">{match.distance} km</Text>
                      </VStack>

                      <VStack align="start" spacing={0}>
                        <HStack fontSize="sm" color="gray.600">
                          <FiClock />
                          <Text>ETA</Text>
                        </HStack>
                        <Text fontWeight="bold">{match.estimatedArrival}</Text>
                      </VStack>
                    </HStack>
                  </VStack>

                  <VStack align="start" spacing={3}>
                    <Box>
                      <Text fontWeight="bold" fontSize="sm" mb={2}>
                        Matched Skills
                      </Text>
                      <HStack flexWrap="wrap">
                        {match.skills.map((skill, idx) => (
                          <Badge key={idx} colorScheme="blue">
                            {skill.replace(/_/g, ' ').toUpperCase()}
                          </Badge>
                        ))}
                      </HStack>
                    </Box>

                    <Box>
                      <Text fontWeight="bold" fontSize="sm" mb={1}>
                        SOS Request ID
                      </Text>
                      <Text color="gray.600">{match.sosRequestId}</Text>
                    </Box>

                    <Badge
                      colorScheme={match.availability ? 'green' : 'red'}
                      alignSelf="start"
                    >
                      {match.availability ? 'Available' : 'Not Available'}
                    </Badge>

                    <Button colorScheme="brand" size="sm" w="full">
                      Assign Volunteer
                    </Button>
                  </VStack>
                </SimpleGrid>
              </CardBody>
            </Card>
          ))}
        </VStack>
      )}
    </Box>
  )
}

export default Matching
