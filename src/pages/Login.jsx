import { useState } from 'react'
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  VStack,
  Text,
  Link as ChakraLink,
  Card,
  CardBody,
  useToast,
  InputGroup,
  InputRightElement,
  IconButton,
  Divider,
  HStack,
} from '@chakra-ui/react'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import { Link, useNavigate } from 'react-router-dom'
import { authService } from '../services/api'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const toast = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await authService.login(formData)
      localStorage.setItem('authToken', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
      
      toast({
        title: 'Login successful',
        description: `Welcome back, ${response.data.user.name}!`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      
      navigate('/dashboard')
    } catch (error) {
      toast({
        title: 'Login failed',
        description: error.response?.data?.message || 'Invalid credentials',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box 
      minH="100vh" 
      bgGradient="linear(to-br, gray.900, blue.900, purple.900)" 
      display="flex" 
      alignItems="center"
      position="relative"
      _before={{
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '50px 50px',
        opacity: 0.3,
      }}
    >
      <Container maxW="md" position="relative">
        <VStack spacing={8}>
          <Box textAlign="center">
            <Heading
              size="2xl"
              bgGradient="linear(to-r, brand.300, cosmic.300)"
              bgClip="text"
              mb={2}
            >
              🚨 RescueMesh
            </Heading>
            <Text color="gray.300">Sign in to your account</Text>
          </Box>

          <Card w="full" bg="gray.800" borderColor="gray.700" boxShadow="2xl">
            <CardBody>
              <form onSubmit={handleSubmit}>
                <VStack spacing={4}>
                  <FormControl isRequired>
                    <FormLabel color="gray.300">Email</FormLabel>
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      bg="gray.700"
                      borderColor="gray.600"
                      _hover={{ borderColor: 'brand.400' }}
                      _focus={{ borderColor: 'brand.400', boxShadow: '0 0 0 1px var(--chakra-colors-brand-400)' }}
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel color="gray.300">Password</FormLabel>
                    <InputGroup>
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        bg="gray.700"
                        borderColor="gray.600"
                        _hover={{ borderColor: 'brand.400' }}
                        _focus={{ borderColor: 'brand.400', boxShadow: '0 0 0 1px var(--chakra-colors-brand-400)' }}
                      />
                      <InputRightElement>
                        <IconButton
                          size="sm"
                          variant="ghost"
                          icon={showPassword ? <FiEyeOff /> : <FiEye />}
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label="Toggle password visibility"
                        />
                      </InputRightElement>
                    </InputGroup>
                  </FormControl>

                  <Button
                    type="submit"
                    colorScheme="brand"
                    w="full"
                    isLoading={loading}
                    size="lg"
                    bgGradient="linear(to-r, brand.500, cosmic.500)"
                    _hover={{ bgGradient: 'linear(to-r, brand.600, cosmic.600)' }}
                  >
                    Sign In
                  </Button>

                  <Divider />

                  <HStack justify="center" w="full">
                    <Text fontSize="sm" color="gray.400">
                      Don't have an account?
                    </Text>
                    <ChakraLink as={Link} to="/register" color="brand.300" fontWeight="medium">
                      Sign up
                    </ChakraLink>
                  </HStack>
                </VStack>
              </form>
            </CardBody>
          </Card>

          <ChakraLink as={Link} to="/" color="brand.300" fontSize="sm">
            ← Back to Home
          </ChakraLink>
        </VStack>
      </Container>
    </Box>
  )
}

export default Login
