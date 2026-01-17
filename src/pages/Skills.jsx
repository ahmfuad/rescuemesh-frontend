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
  Button,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useToast,
  Spinner,
  Input,
  Select,
  Alert,
  AlertIcon,
  Center,
} from '@chakra-ui/react'
import { FiTool, FiPackage, FiCheck, FiX } from 'react-icons/fi'
import { skillService, resourceService } from '../services/api'
import { PROFICIENCY_LEVELS, DISASTER_TYPES } from '../utils/constants'

const Skills = () => {
  const [skills, setSkills] = useState([])
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(false)
  const [filterType, setFilterType] = useState('all')
  const toast = useToast()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [skillsRes, resourcesRes] = await Promise.all([
        skillService.search({}),
        resourceService.search({})
      ])
      setSkills(skillsRes.data.skills || [])
      setResources(resourcesRes.data.resources || [])
    } catch (error) {
      console.error('Failed to fetch data:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch skills and resources',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredSkills = skills.filter((skill) => {
    if (filterType === 'all') return true
    return skill.disasterTypes.includes(filterType)
  })

  const filteredResources = resources.filter((resource) => {
    if (filterType === 'all') return true
    return resource.disasterTypes?.includes(filterType)
  })

  return (
    <Box>
      <Heading mb={6}>Skills & Resources</Heading>

      <Card mb={6}>
        <CardBody>
          <HStack>
            <Text fontWeight="bold" mr={4}>
              Filter by Disaster Type:
            </Text>
            <Select value={filterType} onChange={(e) => setFilterType(e.target.value)} maxW="300px">
              <option value="all">All Types</option>
              {Object.entries(DISASTER_TYPES).map(([key, value]) => (
                <option key={key} value={key}>
                  {value.icon} {value.label}
                </option>
              ))}
            </Select>
          </HStack>
        </CardBody>
      </Card>

      {loading ? (
        <Center py={8}>
          <Spinner size="xl" color="blue.500" />
        </Center>
      ) : (
        <Tabs colorScheme="brand">
          <TabList>
            <Tab>
              <HStack>
                <FiTool />
                <Text>Skills ({filteredSkills.length})</Text>
              </HStack>
            </Tab>
            <Tab>
              <HStack>
                <FiPackage />
                <Text>Resources ({filteredResources.length})</Text>
              </HStack>
            </Tab>
          </TabList>

        <TabPanels>
          {/* Skills Tab */}
          <TabPanel>
            {filteredSkills.length === 0 ? (
              <Alert status="info">
                <AlertIcon />
                No skills found
              </Alert>
            ) : (
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                {filteredSkills.map((skill) => (
                  <Card key={skill.skillId}>
                    <CardBody>
                      <VStack align="stretch" spacing={3}>
                        <HStack justify="space-between">
                          <Text fontSize="xl" fontWeight="bold">
                            {skill.skillName}
                          </Text>
                          {skill.availability === 'available' ? (
                            <FiCheck color="green" size={20} />
                          ) : (
                            <FiX color="red" size={20} />
                          )}
                        </HStack>

                        <Badge
                          colorScheme={PROFICIENCY_LEVELS[skill.certificationLevel]?.color || 'gray'}
                          alignSelf="start"
                        >
                          {PROFICIENCY_LEVELS[skill.certificationLevel]?.label || skill.certificationLevel}
                        </Badge>

                        <Box>
                          <Text fontSize="sm" fontWeight="bold" mb={1}>
                            Skill Type:
                          </Text>
                          <Text fontSize="sm" color="gray.400">
                            {skill.skillType}
                          </Text>
                        </Box>

                        {skill.disasterTypes && skill.disasterTypes.length > 0 && (
                          <Box>
                            <Text fontSize="sm" fontWeight="bold" mb={1}>
                              Applicable to:
                            </Text>
                            <HStack flexWrap="wrap">
                              {skill.disasterTypes.map((type) => (
                                <Badge key={type} colorScheme={DISASTER_TYPES[type]?.color || 'gray'} size="sm">
                                  {DISASTER_TYPES[type]?.icon} {DISASTER_TYPES[type]?.label || type}
                                </Badge>
                              ))}
                            </HStack>
                          </Box>
                        )}

                        {skill.verified && (
                          <Badge colorScheme="green" alignSelf="start">
                            ✓ Verified
                          </Badge>
                        )}

                        <HStack justify="space-between">
                          <Text fontSize="sm">Trust Score:</Text>
                          <Badge colorScheme="blue">{skill.trustScore?.toFixed(1) || 'N/A'}</Badge>
                        </HStack>

                        <Badge colorScheme={skill.availability === 'available' ? 'green' : 'red'} alignSelf="start">
                          {skill.availability?.toUpperCase() || 'UNAVAILABLE'}
                        </Badge>
                      </VStack>
                    </CardBody>
                  </Card>
                ))}
              </SimpleGrid>
            )}
          </TabPanel>

          {/* Resources Tab */}
          <TabPanel>
            {filteredResources.length === 0 ? (
              <Alert status="info">
                <AlertIcon />
                No resources found
              </Alert>
            ) : (
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                {filteredResources.map((resource) => (
                  <Card key={resource.resourceId}>
                    <CardBody>
                      <VStack align="stretch" spacing={3}>
                        <HStack justify="space-between">
                          <VStack align="start" spacing={1}>
                            <Text fontSize="xl" fontWeight="bold">
                              {resource.resourceType?.replace(/_/g, ' ').toUpperCase() || 'RESOURCE'}
                            </Text>
                            {resource.resourceName && (
                              <Text fontSize="sm" color="gray.400">
                                {resource.resourceName}
                              </Text>
                            )}
                          </VStack>
                          {resource.availability === 'available' ? (
                            <FiCheck color="green" size={20} />
                          ) : (
                            <FiX color="red" size={20} />
                          )}
                        </HStack>

                        <HStack justify="space-between">
                          <Text fontSize="sm">Quantity:</Text>
                          <Badge colorScheme="blue">{resource.quantity || 0}</Badge>
                        </HStack>

                        {resource.disasterTypes && resource.disasterTypes.length > 0 && (
                          <Box>
                            <Text fontSize="sm" fontWeight="bold" mb={1}>
                              Applicable to:
                            </Text>
                            <HStack flexWrap="wrap">
                              {resource.disasterTypes.map((type) => (
                                <Badge key={type} colorScheme={DISASTER_TYPES[type]?.color || 'gray'}>
                                  {DISASTER_TYPES[type]?.icon} {DISASTER_TYPES[type]?.label || type}
                                </Badge>
                              ))}
                            </HStack>
                          </Box>
                        )}

                        <Badge colorScheme={resource.availability === 'available' ? 'green' : 'red'} alignSelf="start">
                          {resource.availability?.toUpperCase() || 'UNAVAILABLE'}
                        </Badge>
                      </VStack>
                    </CardBody>
                  </Card>
                ))}
              </SimpleGrid>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
      )}
    </Box>
  )
}

export default Skills
