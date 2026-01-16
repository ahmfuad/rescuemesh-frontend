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

  // Mock data
  const mockSkills = [
    {
      skillId: 'skill-001',
      userId: 'user-001',
      skillName: 'Boat Operation',
      disasterTypes: ['flood'],
      proficiencyLevel: 'expert',
      certifications: ['Marine Safety Certificate'],
      availability: true,
    },
    {
      skillId: 'skill-002',
      userId: 'user-002',
      skillName: 'First Aid',
      disasterTypes: ['flood', 'earthquake', 'fire'],
      proficiencyLevel: 'advanced',
      certifications: ['CPR Certified', 'Emergency Response'],
      availability: true,
    },
    {
      skillId: 'skill-003',
      userId: 'user-001',
      skillName: 'Search & Rescue',
      disasterTypes: ['earthquake', 'landslide'],
      proficiencyLevel: 'expert',
      certifications: ['SAR Professional'],
      availability: false,
    },
  ]

  const mockResources = [
    {
      resourceId: 'res-001',
      userId: 'user-001',
      resourceType: 'rescue_boat',
      quantity: 1,
      condition: 'excellent',
      available: true,
      disasterTypes: ['flood'],
    },
    {
      resourceId: 'res-002',
      userId: 'user-002',
      resourceType: 'first_aid_kit',
      quantity: 5,
      condition: 'good',
      available: true,
      disasterTypes: ['flood', 'earthquake', 'fire'],
    },
  ]

  useEffect(() => {
    setSkills(mockSkills)
    setResources(mockResources)
  }, [])

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
                          {skill.availability ? (
                            <FiCheck color="green" size={20} />
                          ) : (
                            <FiX color="red" size={20} />
                          )}
                        </HStack>

                        <Badge
                          colorScheme={PROFICIENCY_LEVELS[skill.proficiencyLevel]?.color || 'gray'}
                          alignSelf="start"
                        >
                          {PROFICIENCY_LEVELS[skill.proficiencyLevel]?.label || skill.proficiencyLevel}
                        </Badge>

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

                        {skill.certifications && skill.certifications.length > 0 && (
                          <Box>
                            <Text fontSize="sm" fontWeight="bold" mb={1}>
                              Certifications:
                            </Text>
                            {skill.certifications.map((cert, idx) => (
                              <Text key={idx} fontSize="sm" color="gray.600">
                                • {cert}
                              </Text>
                            ))}
                          </Box>
                        )}

                        <Badge colorScheme={skill.availability ? 'green' : 'red'} alignSelf="start">
                          {skill.availability ? 'Available' : 'Not Available'}
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
                          <Text fontSize="xl" fontWeight="bold">
                            {resource.resourceType.replace(/_/g, ' ').toUpperCase()}
                          </Text>
                          {resource.available ? (
                            <FiCheck color="green" size={20} />
                          ) : (
                            <FiX color="red" size={20} />
                          )}
                        </HStack>

                        <HStack justify="space-between">
                          <Text fontSize="sm">Quantity:</Text>
                          <Badge colorScheme="blue">{resource.quantity}</Badge>
                        </HStack>

                        <HStack justify="space-between">
                          <Text fontSize="sm">Condition:</Text>
                          <Badge
                            colorScheme={
                              resource.condition === 'excellent'
                                ? 'green'
                                : resource.condition === 'good'
                                ? 'blue'
                                : 'yellow'
                            }
                          >
                            {resource.condition.toUpperCase()}
                          </Badge>
                        </HStack>

                        {resource.disasterTypes && (
                          <Box>
                            <Text fontSize="sm" fontWeight="bold" mb={1}>
                              Applicable to:
                            </Text>
                            <HStack flexWrap="wrap">
                              {resource.disasterTypes.map((type) => (
                                <Badge key={type} colorScheme={DISASTER_TYPES[type]?.color || 'gray'}>
                                  {DISASTER_TYPES[type]?.icon}
                                </Badge>
                              ))}
                            </HStack>
                          </Box>
                        )}

                        <Badge colorScheme={resource.available ? 'green' : 'red'} alignSelf="start">
                          {resource.available ? 'Available' : 'Not Available'}
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
    </Box>
  )
}

export default Skills
