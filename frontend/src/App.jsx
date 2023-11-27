import { Container } from "@chakra-ui/react"
import { Navigate, Route, Routes } from "react-router-dom"
import UserPage from "./pages/UserPage"
import Header from "./components/Header"
import PostPage from "./pages/PostPage"
import HomePage from "./pages/HomePage"
import AuthPage from "./pages/AuthPage"
import { useRecoilValue } from "recoil"
import userScreenAtom from "./atom/userAtom"
import UpdateProfilePage from "./pages/UpdateProfilePage"
import CreatePost from "./components/createPost"


function App() {

  const user = useRecoilValue(userScreenAtom)

  console.log(user);

  return (
    <Container maxW='650px'>
      <Header />
      <Routes>
        <Route path="/" element={user ? <HomePage /> : <Navigate to='/auth' />} />
        <Route path="/auth" element={!user ? <AuthPage /> : <Navigate to='/' />} />
        <Route path="/update" element={user ? <UpdateProfilePage /> : <Navigate to='/auth' />} />


        <Route path="/:username" element={ user ? 
        (
          <>
        <UserPage />
        <CreatePost />
        </>
        ) 
        :
        (
          <CreatePost />
        )
        } />
        <Route path="/:username/post/:postId" element={<PostPage />} />
      </Routes>
     
    </Container>
  )
}

export default App
