
import userScreenAtom from "../atom/userAtom";
import useShowToast from "./useShowToast";
import { useSetRecoilState } from "recoil";
import { useNavigate } from 'react-router-dom'


export default function useLogout() {

    const setUser = useSetRecoilState(userScreenAtom)
    const showToast = useShowToast()
    const navigate = useNavigate()

    const logout = async () => {
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
    return logout
}