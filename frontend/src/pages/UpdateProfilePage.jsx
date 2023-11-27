
import {
    Button,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Stack,
    useColorModeValue,
    Avatar,
    Center,
} from '@chakra-ui/react'
import { useRef, useState } from 'react'
import { useRecoilState } from 'recoil'
import userScreenAtom from '../atom/userAtom'
import usePreviewImage from '../hooks/usePreviewImage'
import useShowToast from '../hooks/useShowToast'
import { useNavigate } from 'react-router-dom'


export default function UpdateProfilePage() {

    const navigate = useNavigate()
    const [user, setUser] = useRecoilState(userScreenAtom)
    const [inputs, setInputs] = useState({
        name: user.name,
        username: user.username,
        email: user.email,
        profilePic: user.profilePic,
        bio: user.bio,
        password: ''
    })
    const fileRef = useRef(null)
    const [updating, setUpdating] = useState(false)

    const showToast = useShowToast()

    const { handleImageUpdate, imageUrl } = usePreviewImage()

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (updating) return
        setUpdating(true)
        try {

            const res = await fetch(`/api/users/update/${user._id}`, {
                'method': 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ...inputs, profilePic: imageUrl })
            })

            const data = await res.json() // updated user
            console.log(data);


            if (data.error) {
                showToast("Error", data.error, "error");
                return;
            }
            localStorage.setItem('user', JSON.stringify(data))

            showToast("Success", 'Profile updated successfully', "success");
            setUser(data)
            navigate(`/${user.username}`)


        } catch (error) {
            showToast('Error', error, 'error')
        } finally {
            setUpdating(false)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <Flex
                align={'center'} justify={'center'} my={3}  >
                <Stack
                    spacing={4}
                    w={'full'}
                    maxW={'md'}
                    bg={useColorModeValue('white', 'gray.dark')}
                    rounded={'xl'}
                    boxShadow={'lg'}
                    p={6}
                    my={12}>
                    <Heading lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl' }}>
                        User Profile Edit
                    </Heading>
                    <FormControl id="userName">

                        <Stack direction={['column', 'row']} spacing={6}>
                            <Center>
                                <Avatar size="xl" boxShadow={'md'} src={imageUrl || user.profilePic} />
                            </Center>
                            <Center w="full">
                                <Button w="full" onClick={() => fileRef.current.click()}>Change Avatar</Button>
                                <input type='file' hidden ref={fileRef} onChange={handleImageUpdate} />
                            </Center>
                        </Stack>
                    </FormControl>
                    <FormControl id="fullname">
                        <FormLabel>Full name</FormLabel>
                        <Input
                            placeholder="Full name"
                            _placeholder={{ color: 'gray.500' }}
                            type="text"
                            value={inputs.name}
                            onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
                        />
                    </FormControl>
                    <FormControl id="userName">
                        <FormLabel>User name</FormLabel>
                        <Input
                            placeholder="UserName"
                            _placeholder={{ color: 'gray.500' }}
                            type="text"
                            value={inputs.username}
                            onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
                        />
                    </FormControl>
                    <FormControl id="email">
                        <FormLabel>Email address</FormLabel>
                        <Input
                            placeholder="your-email@example.com"
                            _placeholder={{ color: 'gray.500' }}
                            type="email"
                            value={inputs.email}
                            onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
                        />
                    </FormControl>
                    <FormControl id="bio">
                        <FormLabel>Bio</FormLabel>
                        <Input
                            placeholder="Bio"
                            _placeholder={{ color: 'gray.500' }}
                            type="text"
                            value={inputs.bio}
                            onChange={(e) => setInputs({ ...inputs, bio: e.target.value })}
                        />
                    </FormControl>
                    <FormControl id="password">
                        <FormLabel>Password</FormLabel>
                        <Input
                            placeholder="password"
                            _placeholder={{ color: 'gray.500' }}
                            type="password"
                            value={inputs.password}
                            onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
                        />
                    </FormControl>
                    <Stack spacing={6} direction={['column', 'row']}>
                        <Button
                            bg={'red.400'}
                            color={'white'}
                            w="full"
                            _hover={{
                                bg: 'red.500',
                            }}>
                            Cancel
                        </Button>
                        <Button
                            bg={'green.400'}
                            color={'white'}
                            w="full"
                            _hover={{
                                bg: 'green.500',
                            }} type='submit' isLoading={updating}>
                            Submit
                        </Button>
                    </Stack>
                </Stack>
            </Flex>
        </form>
    )
}