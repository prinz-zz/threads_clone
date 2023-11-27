import { useEffect, useState } from "react";
import UserHeader from "../components/Userheader";
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import { Flex, Spinner } from "@chakra-ui/react";
import Post from "../components/Post";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { useRecoilState } from "recoil";
import postsAtom from "../atom/postsAtom";




export default function UserPage() {

    const { user, loading } = useGetUserProfile()
    const [posts, setPosts] = useRecoilState(postsAtom)
    const [fetchingPosts, setFetchingPosts] = useState(true)

    const { username } = useParams()
    const showToast = useShowToast()

    useEffect(() => {

        //get Posts
        const getPosts = async () => {

            setFetchingPosts(true)

            try {
                const res = await fetch(`/api/posts/user/${username}`)
                const data = await res.json()


                if (data.error) {
                    showToast('Error', data.error, 'error')
                    return;
                }

                setPosts(data)

            } catch (error) {
                showToast('Error', error.message, 'error')
                setPosts([])
            } finally {
                setFetchingPosts(false)
            }
        }

        getPosts()
    }, [username, showToast, setPosts]);

    //console.log('data is here :', posts);

    if (!user && loading) {
        return (
            <Flex justifyContent={'center'}>
                <Spinner size={'md'} />
            </Flex>
        )
    }

    if (!user && !loading) return <h1>User not found</h1>

    return (
        <>
            <UserHeader user={user} />

            {!fetchingPosts && posts.length === 0 && (
                <Flex justifyContent={'center'} mt={10}>
                    <h1>No posts found</h1>
                </Flex>
            )}

            {fetchingPosts && (
                <Flex justifyContent={'center'} mt={10}>
                    <Spinner size={'md'} />
                </Flex>
            )}

            {posts.map((post) => (
                <Post key={post._id} post={post} postedBy={post.postedBy} />
            ))}

        </>
    )
}