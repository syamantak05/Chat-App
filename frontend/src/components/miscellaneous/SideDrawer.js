import { Button } from '@chakra-ui/button';
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { Box, Text } from '@chakra-ui/layout';
import { Avatar, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Input, Menu, MenuButton, MenuItem, MenuList, Spinner, useToast } from '@chakra-ui/react';
import { Tooltip } from '@chakra-ui/tooltip';
import React, { useState } from 'react';
import { ChatState } from "../../Context/ChatProvider";
import ProfileModal from './ProfileModal';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { useDisclosure } from '@chakra-ui/hooks';
import ChatLoading from '../ChatLoading';
import UserListItem from '../UserAvatar/UserListItem';
import axios from "axios";
// import NotificationBadge from "react-notification-badge";


const SideDrawer = () => {
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);

    const { user, setSelectedChat, chats, setChats } = ChatState(); 
    const { isOpen, onOpen, onClose } = useDisclosure();

    const history = useHistory();
    const logoutHandler = () => {
        localStorage.removeItem("userInfo");
        history.push("/");
    };

    const toast = useToast();

    const handleSearch = async () => {
        if (!search) {
          toast({
            title: "Please Enter something in search",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "top-left",
          });
          return;
        }
    
        try {
          setLoading(true);
    
          const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };
    
          const { data } = await axios.get(`/api/user?search=${search}`, config);
    
          setLoading(false);
          setSearchResult(data);
        } catch (error) {
          toast({
            title: "Error Occured!",
            description: "Failed to Load the Search Results",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom-left",
          });
        }
    };

    const accessChat  = async (userId) => {
        try {
            setLoadingChat(true);
            const config = {
              headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${user.token}`,
              },
            };
            const { data } = await axios.post(`/api/chat`, { userId }, config);
      
            if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
            setSelectedChat(data);
            setLoadingChat(false);
            onClose();
          } catch (error) {
            toast({
              title: "Error fetching the chat",
              description: error.message,
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "bottom-left",
            });
          }
    };

    return (
        <>
            <Box display="flex" justifyContent="space-between" alignItems="center" bg="white" w="100%" padding="5px 10px 5px 10px" borderWidth="5px">

                <Tooltip label="Search Users" hasArrow placement="bottom-end">
                    <Button variant="ghost" onClick={onOpen}> 
                        <i class="fas fa-search"></i>
                        <Text display={{ base: "none", md: "flex" }} px={4}></Text>
                    </Button>

                </Tooltip>

                <Text fontSize="2xl" fontFamily="Work sans">Talk-A-Tive</Text>

                <div>
                    <Menu>
                        <MenuButton p={1}>
                            <BellIcon fontSize="2xl" margin={1} />
                        </MenuButton>
                    </Menu>

                    <Menu>
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon/>}>
                           <Avatar size = "sm" cursor="pointer" name={user.name} src={user.pic}></Avatar>
                        </MenuButton>
                        <MenuList>
                            <ProfileModal user={user}>
                                {/* <MenuItem>My Profile</MenuItem> */}
                            </ProfileModal>
                            <MenuItem onClick={logoutHandler}>Logout</MenuItem>
                        </MenuList>
                    </Menu>
                </div>

            </Box>

            <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay/>

                <DrawerContent>
                    <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
                    <DrawerBody>
                        <Box display="flex" pb={2}>
                            <Input placeholder='Search by name or email' mr={2} value={search} onChange={(e)=>setSearch(e.target.value)}/>
                            <Button onClick={handleSearch}>Go</Button>
                        </Box>
                        {loading?(
                            <ChatLoading/>
                        ):(
                            searchResult?.map((user)=>
                                <UserListItem key = {user._id} user = {user} handleFunction = {()=>accessChat(user._id)}/>
                            )
                        )
                        }
                        {loadingChat && <Spinner ml = "auto" display = "flex"/>}
                    </DrawerBody>
                </DrawerContent>

                
            </Drawer>
        </>
    )
}

export default SideDrawer;