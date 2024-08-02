import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, useToast } from "@chakra-ui/react";
import React, { useCallback, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";

const Signup = () => {
    const [show, setShow] = useState(false);
    const handleClick = () => setShow(!show);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmpassword, setConfirmpassword] = useState("");
    const [pic, setPic] = useState();
    const [picLoading, setLoading] = useState(false); // Added picLoading state
    const history = useHistory();
    //const [loading, setLoading] = useState(false);
    const toast = useToast(); // Added useToast hook

    const postDetails = useCallback((pics) => {
        setLoading(true);
        if (!pics) {
          toast({
            title: 'Please select an image',
            status: 'warning',
            duration: 5000,
            isClosable: true,
            position: 'bottom',
          });
          setLoading(false);
          return;
        }
        if (pics.type === 'image/jpeg' || pics.type === 'image/png') {
          const data = new FormData();
          data.append('file', pics);
          data.append('upload_preset', 'chat_app');
          data.append('cloud_name', 'dqiiyvfpu');
          fetch('https://api.cloudinary.com/v1_1/dqiiyvfpu/image/upload', {
            method: 'post',
            body: data,
          })
            .then((res) => res.json())
            .then((data) => {
              setPic(data.public_id.toString());
              setLoading(false);
              console.log(data)
            })
            .catch((err) => {
              console.error(err);
              setLoading(false);
            });
        } else {
          toast({
            title: 'Please select a valid image',
            status: 'warning',
            duration: 5000,
            isClosable: true,
            position: 'bottom',
          });
          setLoading(false);
        }
      }, [toast]);

    const submitHandler = async() => {
        setLoading(true);
        if(!name || !email || !password || !confirmpassword){
            toast({
                title: "please fill in all the details",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            setLoading(false);
            return;
        }

        if(password!==confirmpassword){
            toast({
                title: "passwords do not match!!",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            setLoading(false);
            return;
        }

        try{
            const config = {
                headers : {
                    "Content-type": "application/json",

                },
            };
            const data = await axios.post("/api/user", 
                {name, email, password, pic},
                config
            );

            toast({
                title: "Registration is successful", 
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });

            localStorage.setItem('userInfo', JSON.stringify(data));

            setLoading(false);
            history.push("/chats");
        }catch(error){
            toast({
                title: "Error occured!",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            setLoading(false);
        }
    };

    return (
        <VStack spacing="5px">
            <FormControl id="first-name" isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                    placeholder="Enter Your Name"
                    onChange={(e) => setName(e.target.value)}
                />
            </FormControl>

            <FormControl id="email" isRequired>
                <FormLabel>Email Address</FormLabel>
                <Input
                    type="email"
                    placeholder="Enter Your Email Address"
                    onChange={(e) => setEmail(e.target.value)}
                />
            </FormControl>

            <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup size="md">
                    <Input
                        type={show ? "text" : "password"}
                        placeholder="Enter Password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={handleClick}>
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>

            <FormControl id="confirm-password" isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup size="md">
                    <Input
                        type={show ? "text" : "password"}
                        placeholder="Confirm password"
                        onChange={(e) => setConfirmpassword(e.target.value)}
                    />
                    <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={handleClick}>
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>

            <FormControl id="pic">
                <FormLabel>Upload your Picture</FormLabel>
                <Input
                    type="file"
                    p={1.5}
                    accept="image/*"
                    onChange={(e) => postDetails(e.target.files[0])}
                />
            </FormControl>

            <Button
                colorScheme="blue"
                width="100%"
                style={{ marginTop: 15 }}
                onClick={submitHandler}
                isLoading={picLoading}
            >
                Sign Up
            </Button>

            {/* <Button
                variant="solid"
                colorScheme="red"
                width="100%"
                onClick={() => {
                setEmail("guest@example.com");
                setPassword("123456");
            }}
            >
            Get Guest User Credentials
            </Button> */}
        </VStack>
    );
};

export default Signup;
