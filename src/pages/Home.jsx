import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  Card,
  CardBody,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { FiAlertTriangle, FiUsers, FiTool, FiTarget, FiMapPin, FiShield } from 'react-icons/fi'

const Home = () => {
  const navigate = useNavigate()
  const bg = useColorModeValue('white', 'gray.800')

  const features = [
    {
      icon: FiAlertTriangle,
      title: 'Disaster Response',
      description: 'Real-time tracking and coordination of disaster events',
    },
    {
      icon: FiUsers,
      title: 'Volunteer Network',
      description: 'Connect skilled volunteers with those in need',
    },
    {
      icon: FiTarget,
      title: 'Smart Matching',
      description: 'AI-powered matching of skills to emergency requests',
    },
    {
      icon: FiMapPin,
      title: 'Location-Based',
      description: 'Find help near you with geospatial coordination',
    },
    {
      icon: FiTool,
      title: 'Resource Management',
      description: 'Track and allocate emergency resources effectively',
    },
    {
      icon: FiShield,
      title: 'Secure & Reliable',
      description: 'Built with security and reliability at its core',
    },
  ]

  return (
    <Box minH="100vh" bg="gray.50">
      {/* Hero Section */}
      <Box
        bgGradient="linear(to-br, brand.500, brand.700)"
        color="white"
        py={20}
        textAlign="center"
      >
        <Container maxW="container.lg">
          <VStack spacing={6}>
            <Heading size="3xl" fontWeight="bold">
              🚨 RescueMesh
            </Heading>
            <Heading size="lg" fontWeight="normal" opacity={0.9}>
              Right Skill. Right Place. Right Time.
            </Heading>
            <Text fontSize="xl" maxW="2xl" opacity={0.85}>
              A unified disaster coordination platform connecting volunteers, resources,
              and emergency services to save lives.
            </Text>
            <HStack spacing={4} pt={4}>
              <Button
                size="lg"
                colorScheme="white"
                variant="solid"
                color="brand.700"
                onClick={() => navigate('/register')}
              >
                Get Started
              </Button>
              <Button
                size="lg"
                variant="outline"
                borderColor="white"
                color="white"
                _hover={{ bg: 'whiteAlpha.200' }}
                onClick={() => navigate('/login')}
              >
                Sign In
              </Button>
            </HStack>
          </VStack>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxW="container.xl" py={16}>
        <VStack spacing={12}>
          <Box textAlign="center">
            <Heading size="xl" mb={4}>
              Comprehensive Disaster Response Platform
            </Heading>
            <Text fontSize="lg" color="gray.600" maxW="2xl" mx="auto">
              Leveraging technology to coordinate emergency response efforts and save lives
              during natural disasters and emergencies.
            </Text>
          </Box>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8} w="full">
            {features.map((feature, index) => (
              <Card key={index} bg={bg} _hover={{ shadow: 'lg', transform: 'translateY(-4px)' }} transition="all 0.3s">
                <CardBody>
                  <VStack align="start" spacing={4}>
                    <Icon
                      as={feature.icon}
                      boxSize={10}
                      color="brand.500"
                    />
                    <Heading size="md">{feature.title}</Heading>
                    <Text color="gray.600">{feature.description}</Text>
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        </VStack>
      </Container>

      {/* Stats Section */}
      <Box bg="brand.500" color="white" py={16}>
        <Container maxW="container.lg">
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} textAlign="center">
            <Box>
              <Heading size="2xl">500+</Heading>
              <Text fontSize="lg" opacity={0.9} mt={2}>
                Active Volunteers
              </Text>
            </Box>
            <Box>
              <Heading size="2xl">50+</Heading>
              <Text fontSize="lg" opacity={0.9} mt={2}>
                Disaster Responses
              </Text>
            </Box>
            <Box>
              <Heading size="2xl">1000+</Heading>
              <Text fontSize="lg" opacity={0.9} mt={2}>
                Lives Helped
              </Text>
            </Box>
          </SimpleGrid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Container maxW="container.md" py={16} textAlign="center">
        <VStack spacing={6}>
          <Heading size="xl">Ready to Make a Difference?</Heading>
          <Text fontSize="lg" color="gray.600">
            Join our community of volunteers and help coordinate emergency response efforts.
          </Text>
          <Button
            size="lg"
            colorScheme="brand"
            onClick={() => navigate('/register')}
          >
            Join RescueMesh Today
          </Button>
        </VStack>
      </Container>

      {/* Footer */}
      <Box bg="gray.800" color="white" py={8}>
        <Container maxW="container.lg">
          <VStack spacing={4}>
            <Text fontSize="sm" opacity={0.8}>
              © 2026 RescueMesh. Building resilient communities through technology.
            </Text>
            <HStack spacing={4}>
              <Button variant="link" color="white" size="sm" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button variant="link" color="white" size="sm" onClick={() => navigate('/register')}>
                Register
              </Button>
            </HStack>
          </VStack>
        </Container>
      </Box>
    </Box>
  )
}

export default Home
