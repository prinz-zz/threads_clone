import { Avatar, Box, Button, Divider, Flex, Image, Spinner, Text } from "@chakra-ui/react";
import Actions from "../components/Actions";
import { useEffect } from "react";
import Comment from "../components/Comment";
import useGetUserProfile from "../hooks/useGetUserProfile";
import useShowToast from "../hooks/useShowToast";
import { useNavigate, useParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { useRecoilState, useRecoilValue } from "recoil";
import userScreenAtom from "../atom/userAtom";
import { DeleteIcon } from "@chakra-ui/icons";
import postsAtom from "../atom/postsAtom";


export default function PostPage() {

    const { loading, user } = useGetUserProfile()
    //const [post, setPost] = useState(null)
    const showToast = useShowToast()
    const { postId } = useParams()
    const currentUser = useRecoilValue(userScreenAtom)
    const navigate = useNavigate()
    const [posts, setPosts] = useRecoilState(postsAtom)

    const currentPost = posts[0]


    useEffect(() => {

        const getPost = async () => {
            setPosts([])
            try {
                const res = await fetch(`/api/posts/${postId}`)
                const data = await res.json()
                if (data.error) {
                    showToast('Error', data.error, 'error')
                    return;
                }
                setPosts([data])


            } catch (error) {
                showToast('Error', error.message, 'error')
            }
        }
        getPost()
    }, [showToast, postId, setPosts])

    if (!user && loading) {
        return (
            <Flex justifyContent={'center'}>
                <Spinner size={'md'} />
            </Flex>
        )
    }



    //delete post
    const deletePost = async () => {

        try {
            if (!window.confirm('Are you sure you want to delete this post?')) return

            const res = await fetch(`/api/posts/delete/${postId}`, {
                method: 'DELETE',
            })

            const data = await res.json()



            if (data.error) {
                showToast("Error", data.error, "error");
                return;
            }
            showToast('Success', 'Post Deleted successfully', 'success')
            navigate(`/${user.username}`)

        } catch (error) {
            showToast('Error', error.message, 'error')
        }

    }

    if (!currentPost) return null



    return (
        <>
            <Flex justifyContent={'space-between'}>
                <Flex alignItems={'center'} gap={3}>
                    <Avatar src={user.profilePic} name="Mark" size={'md'} />
                    <Flex>
                        <Text fontSize={'sm'} fontWeight={'bold'}>{user.username}</Text>
                        <Image src="/verified.png" w={4} h={4} ml={4} />
                    </Flex>
                </Flex>
                <Flex gap={2} alignItems={'center'} >
                    <Text fontSize={'sm'} color={"gray.light"}>
                        {formatDistanceToNow(new Date(currentPost.createdAt))} ago
                    </Text>
                    {currentUser?._id === user._id && (
                        <DeleteIcon onClick={deletePost} cursor={'pointer'} />
                    )}
                </Flex>
            </Flex>
            <Text mb={2}>{currentPost?.text}</Text>

            <Flex gap={3} my={3}>
                <Actions post={currentPost} />
            </Flex>


            <Divider my={4} />
            <Flex justifyContent={"space-between"}>
                <Flex gap={2} alignItems={'center'}>
                    <Text fontSize={'2xl'}>👏</Text>
                    <Text color={'gray.light'}>Get the app to like, reply</Text>
                </Flex>
                <Button>
                    Get
                </Button>
            </Flex>
            <Divider my={4} />
            {currentPost.replies?.map((reply) => (
                <Comment
                    key={reply._id}
                    reply={reply}
                    lastReply={reply._id === currentPost.replies[currentPost.replies.length - 1]._id}
                />
            ))}


        </>
    )
}