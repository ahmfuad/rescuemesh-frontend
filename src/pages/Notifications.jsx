import { useEffect, useState } from 'react'
import {
  Box,
  Heading,
  Card,
  CardBody,
  Text,
  Badge,
  VStack,
  HStack,
  Alert,
  AlertIcon,
} from '@chakra-ui/react'
import { FiBell, FiCheck, FiAlertCircle, FiInfo } from 'react-icons/fi'
import { format } from 'date-fns'

const Notifications = () => {
  const [notifications, setNotifications] = useState([])

  // Mock data
  const mockNotifications = [
    {
      notificationId: 'notif-001',
      userId: 'user-001',
      type: 'sos_match',
      priority: 'high',
      message: 'You have been matched to an emergency request',
      data: {
        sosRequestId: 'sos-001',
        location: 'Delhi, India',
      },
      channels: ['sms', 'push'],
      status: 'sent',
      createdAt: '2026-01-16T10:05:00Z',
    },
    {
      notificationId: 'notif-002',
      userId: 'user-002',
      type: 'disaster_alert',
      priority: 'critical',
      message: 'New flood disaster reported in your area',
      data: {
        disasterId: 'disaster-001',
        location: 'Delhi, India',
      },
      channels: ['sms', 'push'],
      status: 'sent',
      createdAt: '2026-01-16T09:00:00Z',
    },
    {
      notificationId: 'notif-003',
      userId: 'user-001',
      type: 'assignment_update',
      priority: 'medium',
      message: 'Your SOS assignment has been updated',
      data: {
        sosRequestId: 'sos-001',
      },
      channels: ['push'],
      status: 'delivered',
      createdAt: '2026-01-16T08:30:00Z',
    },
  ]

  useEffect(() => {
    setNotifications(mockNotifications)
  }, [])

  const getIcon = (type) => {
    switch (type) {
      case 'sos_match':
        return <FiBell />
      case 'disaster_alert':
        return <FiAlertCircle />
      case 'assignment_update':
        return <FiInfo />
      default:
        return <FiBell />
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical':
        return 'red'
      case 'high':
        return 'orange'
      case 'medium':
        return 'yellow'
      case 'low':
        return 'blue'
      default:
        return 'gray'
    }
  }

  return (
    <Box>
      <Heading mb={6}>Notifications</Heading>

      {notifications.length === 0 ? (
        <Alert status="info">
          <AlertIcon />
          No notifications
        </Alert>
      ) : (
        <VStack spacing={4} align="stretch">
          {notifications.map((notification) => (
            <Card key={notification.notificationId}>
              <CardBody>
                <HStack align="start" spacing={4}>
                  <Box
                    p={3}
                    borderRadius="full"
                    bg={`${getPriorityColor(notification.priority)}.50`}
                    color={`${getPriorityColor(notification.priority)}.500`}
                  >
                    {getIcon(notification.type)}
                  </Box>

                  <VStack align="start" flex="1" spacing={2}>
                    <HStack justify="space-between" w="full">
                      <HStack spacing={2}>
                        <Badge
                          colorScheme={getPriorityColor(notification.priority)}
                          fontSize="0.8em"
                        >
                          {notification.priority?.toUpperCase()}
                        </Badge>
                        <Badge colorScheme="purple" fontSize="0.8em">
                          {notification.type.replace(/_/g, ' ').toUpperCase()}
                        </Badge>
                      </HStack>
                      <Text fontSize="sm" color="gray.500">
                        {format(new Date(notification.createdAt), 'PPp')}
                      </Text>
                    </HStack>

                    <Text fontWeight="bold">{notification.message}</Text>

                    {notification.data && (
                      <Box>
                        {notification.data.sosRequestId && (
                          <Text fontSize="sm" color="gray.600">
                            SOS Request: {notification.data.sosRequestId}
                          </Text>
                        )}
                        {notification.data.disasterId && (
                          <Text fontSize="sm" color="gray.600">
                            Disaster: {notification.data.disasterId}
                          </Text>
                        )}
                        {notification.data.location && (
                          <Text fontSize="sm" color="gray.600">
                            Location: {notification.data.location}
                          </Text>
                        )}
                      </Box>
                    )}

                    <HStack>
                      <Text fontSize="sm" color="gray.500">
                        Channels:
                      </Text>
                      {notification.channels?.map((channel, idx) => (
                        <Badge key={idx} colorScheme="blue" size="sm">
                          {channel.toUpperCase()}
                        </Badge>
                      ))}
                    </HStack>

                    <HStack>
                      {notification.status === 'sent' && (
                        <Badge colorScheme="green">
                          <HStack spacing={1}>
                            <FiCheck size={12} />
                            <Text>SENT</Text>
                          </HStack>
                        </Badge>
                      )}
                      {notification.status === 'delivered' && (
                        <Badge colorScheme="blue">
                          <HStack spacing={1}>
                            <FiCheck size={12} />
                            <FiCheck size={12} />
                            <Text>DELIVERED</Text>
                          </HStack>
                        </Badge>
                      )}
                    </HStack>
                  </VStack>
                </HStack>
              </CardBody>
            </Card>
          ))}
        </VStack>
      )}
    </Box>
  )
}

export default Notifications
