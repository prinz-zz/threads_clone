import { Flex, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import Post from "../components/Post";
import { useRecoilState } from "recoil";
import postsAtom from "../atom/postsAtom";


export default function HomePage() {

    const showToast = useShowToast()
    const [posts, setPosts] = useRecoilState(postsAtom)
    const [loading, setLoading] = useState(true)

    

    useEffect(() => {
        const getFeedPosts = async () => {

            setLoading(true)
            setPosts([])
            
            try {
                const res = await fetch('/api/posts/feed')
                const data = await res.json()
                if (data.error) {
                    showToast('Error', data.error, 'error')
                    return
                }
                setPosts(data)

            } catch (error) {
                showToast('Error', error.message, 'error')
            } finally {
                setLoading(false)
            }
        }
        getFeedPosts()
    }, [showToast])


    return (
        <>
            {loading && (
                <Flex justifyContent={'center'}>
                    <Spinner size={'md'} />
                </Flex>
            )}

            <Flex justifyContent={'center'}>
                {!loading && posts.length === 0 && <h1>Follow some users to see the feed</h1>}
            </Flex>

            {posts?.map((post) =>(
                <Post key={post._id} post={post} postedby={post.postedBy}/>
            ))}

        </>
    )
}