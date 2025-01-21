import { Flex, Text } from '@chakra-ui/react'
import React from 'react'
import DynamicEmployeeTableWithGraph from './EmployerDashboard'

function Dashboard() {
  return (
    <Flex justify={'center'} align={'center'} w={'100%'} h={'100dvh'} fontSize={'2xl'} fontWeight={600}>
        <DynamicEmployeeTableWithGraph/>
    </Flex>
  )
}

export default Dashboard
