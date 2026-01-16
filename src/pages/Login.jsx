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
    <Box minH="100vh" bg="gray.50" display="flex" alignItems="center">
      <Container maxW="md">
        <VStack spacing={8}>
          <Box textAlign="center">
            <Heading
              size="2xl"
              bgGradient="linear(to-r, brand.500, brand.700)"
              bgClip="text"
              mb={2}
            >
              🚨 RescueMesh
            </Heading>
            <Text color="gray.600">Sign in to your account</Text>
          </Box>

          <Card w="full">
            <CardBody>
              <form onSubmit={handleSubmit}>
                <VStack spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>Email</FormLabel>
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Password</FormLabel>
                    <InputGroup>
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
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
                  >
                    Sign In
                  </Button>

                  <Divider />

                  <HStack justify="center" w="full">
                    <Text fontSize="sm" color="gray.600">
                      Don't have an account?
                    </Text>
                    <ChakraLink as={Link} to="/register" color="brand.500" fontWeight="medium">
                      Sign up
                    </ChakraLink>
                  </HStack>
                </VStack>
              </form>
            </CardBody>
          </Card>

          <ChakraLink as={Link} to="/" color="brand.500" fontSize="sm">
            ← Back to Home
          </ChakraLink>
        </VStack>
      </Container>
    </Box>
  )
}

export default Login
