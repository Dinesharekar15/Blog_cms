import { ImagePlus } from "lucide-react";
import { ChangeEvent, useRef } from "react"

interface ImageUploadProps{
    image:File| null;
    setImage:(file:File|null)=> void
}
const ImageUploader=({image,setImage}:ImageUploadProps)=>{
    const fileInputRef=useRef<HTMLInputElement>(null);

    const handleSelect=(e:ChangeEvent<HTMLInputElement>)=>{
        const file=e.target.files?.[0];
        if(!file) return
        if(!file.type.startsWith("image/")){
            alert("Only Image are allowed")
            return
        }
        if(file.size>5*1024*1024){
            alert("File size should be less than 5MB")
            return
        }
        setImage(file)
    }

    return(
        <div className="mt-6">
            <div onClick={()=>{fileInputRef.current?.click()}} 
            className="cursor-pointer border-2 border-dashed border-gray-600 rounded-lg p-6 flex flex-col items-center justify-center hover:border-orange-500 transition">
                <ImagePlus className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-gray-400 text-sm">
                    {image?"Change Image":"Upload Image"}
                </p>
            </div>
            <input
                ref={fileInputRef}
                type="file"
                hidden
                onChange={handleSelect}
                accept="image/*" 
            />
            {
                image&&(
                    <div className="mt-4">
                        <p className="text-sm text-gray-400 mb-2">Preview:</p>
                        <img
                            src={URL.createObjectURL(image)}
                            alt="Preview"
                            className="w-full h-48 object-cover rounded-lg" 
                        />
                    </div>
                )
            }
        </div>
    )
}

export default ImageUploader