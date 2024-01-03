import React, { Dispatch, SetStateAction } from 'react'
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@chakra-ui/react'
import { StandaloneStructServiceProvider } from 'ketcher-standalone'
import { Editor } from 'ketcher-react'

import 'ketcher-react/dist/index.css'

const structServiceProvider = new StandaloneStructServiceProvider()

declare global {
  //eslint-disable-next-line
  var ketcher: any
}

type ChemProps = {
  setInput: Dispatch<SetStateAction<string>>
}

const ChemEditor: React.FC<ChemProps> = ({ setInput }) => {
  const onClick: () => Promise<void> = async () => {
    const smiles = await global.ketcher.getSmiles()
    setInput(smiles)
    onClose()
  }
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
      <Button bgColor="gray.100" color="blue.500" width={40} onClick={onOpen}>
        👉按结构图查询
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent style={{ minWidth: '1200px', minHeight: '700px' }}>
          <ModalBody>
            <Editor
              errorHandler={() => {}}
              staticResourcesUrl={''}
              structServiceProvider={structServiceProvider}
              onInit={async (ketcher) => {
                global.ketcher = ketcher
                ketcher.setMolecule('')
              }}
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              取消
            </Button>
            <Button onClick={onClick}>查询</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default ChemEditor
