import { useState } from 'react'

import LeftBar from './LeftBar'
import NavBar from './NavBar'
import { Outlet } from 'react-router-dom'
import { Flex } from '@chakra-ui/react'

function MainLayout(): JSX.Element {
  const [toggle, setToggle] = useState<boolean>(true)

  return (
    <>
      <LeftBar toggle={toggle} />
      <NavBar toggle={toggle} setToggle={setToggle} />
      <Flex
        ml={`${toggle ? '170px' : '55px'}`}
        pt={20}
        bgColor="lightgrey"
        height="100vh"
        direction="column"
      >
        <Outlet />
      </Flex>
    </>
  )
}

export default MainLayout
