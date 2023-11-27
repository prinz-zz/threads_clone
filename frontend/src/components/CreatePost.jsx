import { AddIcon } from "@chakra-ui/icons";
import { Button, CloseButton, Flex, FormControl, Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, Textarea, useColorModeValue, useDisclosure } from "@chakra-ui/react";
import { useRef, useState } from "react";
import usePreviewImage from "../hooks/usePreviewImage";
import { BsFillImageFill } from "react-icons/bs";
import { useRecoilState, useRecoilValue } from "recoil";
import userScreenAtom from "../atom/userAtom";
import useShowToast from "../hooks/useShowToast";
import postsAtom from "../atom/postsAtom";
import { useParams } from "react-router-dom";



export default function CreatePost() {

    const maxChar = 500

    const { isOpen, onOpen, onClose } = useDisclosure()
    const [postText, setPostText] = useState('')
    const { handleImageUpdate, imageUrl, setImageUrl } = usePreviewImage()
    const [remaingChar, setRemaingChar] = useState(maxChar)
    const user = useRecoilValue(userScreenAtom)
    const showToast = useShowToast()
    const [loading, setLoading] = useState(false)
    const [posts, setposts] = useRecoilState(postsAtom)
    const { username } = useParams()


    const imageRef = useRef(null)

    const handleTextChange = (e) => {
        e.preventDefault()
        const inputText = e.target.value

        if (inputText.length > maxChar) {
            const tuncatedtText = inputText.slice(0, maxChar)
            setPostText(tuncatedtText)
            setRemaingChar(0)
        } else {
            setPostText(inputText)
            setRemaingChar((maxChar - inputText.length))
        }

    }

    const handleCreatePost = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/posts/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    postedBy: user._id,
                    text: postText,
                    img: imageUrl
                })
            })

            const data = await res.json()


            if (data.error) {
                showToast('Error', data.error, 'error')

            } else {
                showToast('Success', 'Post created successfully', 'success')
                if (username === user.username) {
                    setposts([data, ...posts])
                }
                onClose()
                setPostText('')
                setImageUrl('')
                //window.location.reload(true)
                console.log(data, posts);
            }

        } catch (error) {
            showToast('Error', error, 'error')
        } finally {
            setLoading(false)
        }
    }


    return (
        <>
            <Button
                position={"fixed"}
                bottom={10}
                right={5}
                bg={useColorModeValue('gray.300', 'gray.dark')}
                onClick={onOpen}
                size={{ base: 'sm', md: 'md' }}
            >
                <AddIcon />
            </Button>

            <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
                <ModalOverlay />
                <ModalContent >
                    <ModalHeader>Create post</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <FormControl>
                            <Textarea placeholder="Write..." onChange={handleTextChange} value={postText} />
                            <Text fontSize={'xs'} fontWeight={'bold'} py={1} textAlign={'right'} color={'gray.400'}>
                                {remaingChar}/{maxChar}
                            </Text>

                            <Input
                                type="file"
                                hidden
                                ref={imageRef}
                                onChange={handleImageUpdate}
                            ></Input>
                            <BsFillImageFill style={{
                                marginLeft: '5px',
                                cursor: 'pointer'
                            }}
                                size={16}
                                onClick={() => imageRef.current.click()}
                            />
                        </FormControl>

                        {imageUrl && (
                            <Flex mt={5} w={"full"} position={"relative"}>
                                <Image src={imageUrl} alt='Selected img' />
                                <CloseButton
                                    onClick={() => {
                                        setImageUrl("");
                                    }}
                                    bg={"gray.800"}
                                    position={"absolute"}
                                    top={2}
                                    right={2}
                                />
                            </Flex>
                        )}

                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={handleCreatePost} isLoading={loading}>
                            Post
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

        </>
    )
}