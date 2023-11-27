import { Avatar, Box, Flex, Image, Text } from "@chakra-ui/react";
import { BsThreeDots } from "react-icons/bs";
import { Link } from "react-router-dom";
import Actions from "./Actions";
import { useState } from "react";


export default function UserPost({ likes, replies, postImg, postTitle }) {

    const [liked, setLiked] = useState(false)

    return (
        <>
            <Link to='/mark/post/12'>
                <Flex gap={3} mb={4} py={5}>
                    <Flex flexDirection={'column'} alignItems={'center'}>
                        <Avatar size={'md'} name="Mark" src="/zuck-avatar.png" />
                        <Box w={'1px'} h={'full'} my={2} bg={'gray.light'}></Box>
                        <Box width={'full'} position={"relative"}>
                            
                            <Avatar
                                size={'xs'}
                                name="adam"
                                src='https://bit.ly/dan-abramov'
                                position={'absolute'}
                                top={'0px'}
                                left={'15px'}
                                p={"2px"} />

                            <Avatar
                                size={'xs'}
                                name="adam"
                                src='https://bit.ly/ryan-florence'
                                position={'absolute'}
                                bottom={'0px'}
                                right={'-5px'}
                                p={"2px"} />

                            <Avatar
                                size={'xs'}
                                name="adam"
                                src='https://bit.ly/kent-c-dodds'
                                position={'absolute'}
                                bottom={'0px'}
                                left={'4px'}
                                p={"2px"}
                            />
                        </Box>
                    </Flex>

                    <Flex flex={1} flexDirection={"column"} gap={2}>
                        <Flex justifyContent={'space-between'} w={'full'}>
                            <Flex w={'full'} alignItems={'center'}>
                                <Text fontSize={'sm'} fontWeight={'bold'} >Mark</Text>
                                <Image src={'/verified.png'} w={4} h={4} ml={1} />
                            </Flex>
                            <Flex gap={4} alignItems={'center'}>
                                <Text fontSize={'sm'} color={"gray.light"}>1d</Text>
                                <BsThreeDots />
                            </Flex>
                        </Flex>
                        <Text fontSize={'sm'}>{postTitle}</Text>
                        {postImg && <Box
                            borderRadius={6}
                            overflow={'hidden'}
                            border={'1px solid'}
                            borderColor={'gray.light'}
                        >
                            <Image src={postImg} w={'full'} />
                        </Box>}

                        <Flex gap={3} my={1}>
                            <Actions liked={liked} setLiked={setLiked} />
                        </Flex>

                        <Flex gap={2} alignItems={'center'}>
                            <Text color={'gray.light'} fontSize={'sm'}>{replies} replis</Text>
                            <Box w={0.5} height={0.5} borderRadius={'full'} bg={'gray.light'}></Box>
                            <Text color={'gray.light'} fontSize={'sm'}>{likes} likes</Text>
                        </Flex>

                    </Flex>



                </Flex>

            </Link>
        </>
    )
}