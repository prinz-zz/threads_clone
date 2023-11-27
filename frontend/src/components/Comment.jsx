import { Avatar, Center, Divider, Flex, Text } from "@chakra-ui/react"
import { useState } from "react"
// import { BsThreeDots } from "react-icons/bs"
// import Actions from "./Actions"
// import { formatDistanceToNow } from "date-fns"


export default function Comment({reply, lastReply}){

    const [liked, setLiked] = useState(false)
    
    return(
        <>
            <Flex gap={4} py={2} my={2} w={'full'}>
                <Avatar src={reply.userProfilePic} name={reply.username}/>
                <Flex gap={1} w={'full'} flexDirection={'column'}>
                    <Flex w={'full'} justifyContent={'space-between'} alignItems={'center'}>
                        <Text fontSize={'sm'} fontWeight={'bold'} >{reply.username}</Text>
                       
                    </Flex>
                    <Text>{reply.text}</Text>
                   
                    <Text fontSize={'sm'} color={'gray.light'}>
                        {100 + (liked ? 1 : 0)} likes
                    </Text>
                </Flex>
            
            </Flex>
            {!lastReply ? <Divider/> : null }
        </>
    )
}