import React, { useState } from "react";
import { useDisclosure } from "@chakra-ui/hooks"
import { Button, IconButton } from "@chakra-ui/button";
import { ViewIcon } from "@chakra-ui/icons";
import { Avatar, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text } from "@chakra-ui/react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const ProfileModal = ({user, children}) => {
    //console.log(user)
    const [imgError, setImgError] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();


    

    return(
        <>
            {children ? (
            <span onClick={onOpen}>{children}</span> 
            ) : (
            <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
            )}
        <Modal size="lg" onClose={onClose} isOpen={isOpen} isCentered>
            <ModalOverlay />

            <ModalContent h="410px">
            
                <ModalHeader fontSize="40px" fontFamily="Work sans" display="flex" justifyContent="center">
                    {user.name}
                </ModalHeader>

                <ModalCloseButton />
            <ModalBody display="flex" flexDir="column" alignItems="center" justifyContent="space-between">
            {imgError ? (
                        <Avatar size="2xl" name={user.name} />
                        ) : (
                            <Image
                                borderRadius="full"
                                boxSize="150px"
                                src={user.pic}
                                alt={user.name}
                                onError={() => setImgError(true)}
                            />
                        )}
            <Text fontSize={{ base: "28px", md: "30px" }} fontFamily="Work sans">
              Email: {user.email}
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
        </Modal>
        </>
    )
}

export default ProfileModal;
