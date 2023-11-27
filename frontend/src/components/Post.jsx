import { Avatar, Box, Flex, Image, Text } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import Actions from "./Actions";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { formatDistanceToNow } from 'date-fns'
import { DeleteIcon } from "@chakra-ui/icons";
import { useRecoilState, useRecoilValue } from "recoil";
import userScreenAtom from "../atom/userAtom";
import postsAtom from "../atom/postsAtom";


export default function Post({ post, postedBy }) {
    const [user, setUser] = useState(null)
    const showToast = useShowToast()
    const navigate = useNavigate()
    const currentUser = useRecoilValue(userScreenAtom)
    const [posts, setPosts] = useRecoilState(postsAtom)

    
    useEffect(() => {
        const getUser = async () => {
            
            try {
                const res = await fetch(`/api/users/profile/${post.postedBy}`)               
                const data = await res.json()
                if (data.error) {
                    showToast('Error', data.error, 'error')
                    return
                }
                setUser(data)
                
            } catch (error) {
                showToast('Error', error.message, 'error')
                setUser(null)
            }
        }
        getUser()


    }, [post.postedBy, showToast])

   

    //delete Post
    const deletePost = async (e) => {

        try {
            e.preventDefault()
            if (!window.confirm('Are you sure you want to delete this post?')) return

            const res = await fetch(`/api/posts/delete/${post._id}`,
            {
                method: 'DELETE',
            })

            const data = await res.json()

            if(data.error){
                showToast('Error', data.error, 'error')
            }

            showToast('Success', 'Post deleted', 'success')
            setPosts((prev) => prev.filter((p) => p._id !== post._id) )

            console.log(data);

        } catch (error) {
            showToast('Error', error.message, 'error')
        }
    }
    if (!user) return null

    

    return (
        <>
            <Link to={`/${user.username}/post/${post._id}`}>
                <Flex gap={3} mb={4} py={5}>
                    <Flex flexDirection={'column'} alignItems={'center'}>
                        <Avatar size={'md'} name={user.name}  src={user.profilePic}
                            onClick={(e) => {
                                e.preventDefault()
                                navigate(`/${user.username}`)
                            }}
                        />
                        <Box w={'1px'} h={'full'} my={2} bg={'gray.light'}></Box>
                        <Box width={'full'} position={"relative"}>
                            {post.replies?.length === 0 && <Text textAlign={'center'}>😌</Text>}
                            {post?.replies[0] && (
                                <Avatar
                                    size={'xs'}
                                    name="adam"
                                    src={post.replies[0].userProfilePic}
                                    position={'absolute'}
                                    top={'0px'}
                                    left={'15px'}
                                    p={"2px"} />
                            )}

                            {post?.replies[1] && (
                                <Avatar
                                    size={'xs'}
                                    name="adam"
                                    src={post.replies[1].userProfilePic}
                                    position={'absolute'}
                                    bottom={'0px'}
                                    right={'-5px'}
                                    p={"2px"} />
                            )}

                            {post?.replies[2] && (
                                <Avatar
                                    size={'xs'}
                                    name="adam"
                                    src={post.replies[2].userProfilePic}
                                    position={'absolute'}
                                    bottom={'0px'}
                                    left={'4px'}
                                    p={"2px"}
                                />
                            )}

                        </Box>
                    </Flex>
                    <Flex flex={1} flexDirection={"column"} gap={2}>
                        <Flex justifyContent={'space-between'} w={'full'}>
                            <Flex alignItems={'center'}>
                                <Text fontSize={'sm'} fontWeight={'bold'}
                                    onClick={(e) => {
                                        e.preventDefault()
                                        navigate(`/${user.username}`)
                                    }}
                                >{user.username}</Text>
                                <Image src={'/verified.png'} w={4} h={4} ml={1} />
                            </Flex>
                            <Flex gap={2} alignItems={'center'}>
                                <Text fontSize={'sm'} color={"gray.light"}>
                                    {formatDistanceToNow(new Date(post.createdAt))} ago
                                </Text>
                                {currentUser?._id === user._id && <DeleteIcon onClick={deletePost} />}
                            </Flex>
                        </Flex>
                        <Text fontSize={'sm'}>{post.text}</Text>
                        {post.img && <Box
                            borderRadius={6}
                            overflow={'hidden'}
                            border={'1px solid'}
                            borderColor={'gray.light'}
                        >
                            <Image src={post.img} w={'full'} />
                        </Box>}

                        <Flex gap={3} my={1}>
                            <Actions post={post} />
                        </Flex>

                    </Flex>

                </Flex>

            </Link>
        </>
    )
}