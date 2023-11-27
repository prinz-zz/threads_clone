import { Button } from "@chakra-ui/react"
import { useSetRecoilState } from "recoil"
import userScreenAtom from "../atom/userAtom"
import { useNavigate } from 'react-router-dom'
import { MdLogout } from 'react-icons/Md'
import useShowToast from "../hooks/useShowToast"


export default function LogoutButton() {

    const setUser = useSetRecoilState(userScreenAtom)
    const navigate = useNavigate()
    const showToast = useShowToast()

    const handleLogout = async () => {
        try {

            const res = await fetch('/api/users/logout', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                }
            })
            const data = await res.json()
            if (data.error) {
                showToast("Error", data.error, "error");
                return;
            }

            localStorage.removeItem('user')

            setUser(null)
            navigate('/auth')

        } catch (error) {
            showToast("Error", error, "error");
        }
    }

    return (
        <Button
            position={'fixed'}
            top={5}
            right={5}
            size={{base : 'sm' , md:'md'}}
            title="Logout"
            onClick={handleLogout}
            ><MdLogout /></Button>
    )
}