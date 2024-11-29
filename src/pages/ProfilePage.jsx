import NavBar from "./components/NavBar";
import {useAuth} from "../services/AuthProvider.jsx";
import {useNavigate} from "react-router-dom";

const ProfilePage = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate()

    if (!isAuthenticated) {
        navigate('/login')
    }
    return (
        <>
            <NavBar />
            Profile
        </>
    )
}

export default ProfilePage