import { useRecoilValue } from "recoil";
import LoginCard from "../components/LoginCard";
import SignupCard from "../components/signUpCard";
import authScreenAtom from "../atom/authAtom";


export default function AuthPage() {

    const authScreenState = useRecoilValue(authScreenAtom)
    console.log(authScreenState);

    return (
        <>
            {authScreenState === 'login' ? <LoginCard /> : <SignupCard />}
        </>
    )
}