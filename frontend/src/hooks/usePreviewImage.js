import { useState } from "react";
import useShowToast from "./useShowToast";


const usePreviewImage = () => {

    const [imageUrl, setImageUrl] = useState(null)
    const showToast = useShowToast()

    const handleImageUpdate = (e) => {
        e.preventDefault();
        const file = e.target.files[0]
        if (file && file.type.startsWith('image/')) {

            const reader = new FileReader()

            reader.onloadend = () => {
                setImageUrl(reader.result)
            }
            reader.readAsDataURL(file)
        } else {
            showToast('Invalid file type', 'Please upload an image file', 'error')
            setImageUrl(null)
        }
    }

    return {
        handleImageUpdate,
        imageUrl,
        setImageUrl
    }
}

export default usePreviewImage