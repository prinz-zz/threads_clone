import { Button, Flex, Image, useColorMode } from "@chakra-ui/react"
import { useRecoilValue, useSetRecoilState } from "recoil"
import userScreenAtom from "../atom/userAtom"
import { Link } from 'react-router-dom'
import { AiFillHome } from 'react-icons/ai'
import { RxAvatar } from 'react-icons/rx'
import authScreenAtom from "../atom/authAtom"
import { MdLogout } from "react-icons/Md"
import useLogout from "../hooks/useLogout"


export default function Header() {

    const { colorMode, toggleColorMode } = useColorMode()
    const user = useRecoilValue(userScreenAtom)
    const setAuthScreen = useSetRecoilState(authScreenAtom)
    const logout = useLogout()



    return (
        <>

            <Flex justifyContent={'space-between'} mt={6} mb={12}>

                {user && (
                    <Link to='/'>
                        <AiFillHome size={24} />
                    </Link>
                )}

                {!user && (
                    <Link to='/auth' onClick={() => setAuthScreen('login')}>
                        Login
                    </Link>
                )}

                <Image
                    cursor={"pointer"} alt="logo" w={6}
                    src={colorMode === 'dark' ? '/light-logo.svg' : '/dark-logo.svg'}
                    onClick={toggleColorMode}
                />
                {user && (
                    <Flex alignItems={'center'} gap={4}>
                        <Link to={`/${user.username}`} title="toUserScreen">
                            <RxAvatar size={24} />
                        </Link>

                        <Button size={'xs'} title="Logout" onClick={logout}>
                            <MdLogout size={20}/>
                        </Button>
                    </Flex>
                )}

                {!user && (
                    <Link to='/auth' onClick={() => setAuthScreen('signUp')}>
                        Sign up
                    </Link>
                )}

            </Flex>

        </>
    )
}