import React from 'react'
import Button from '../../../shared/ui/Button';

function ImgContainer({ imgData, setImgData } : { imgData: string, setImgData: any }) {

    
    const [focused, setFocused] = React.useState(false)

    const pasteImg = (e:any) => {
        if(!e.clipboardData) return false; 
        
        var img = e.clipboardData.items[0];
        
        if(!img) return false;
        
        if (!img.type.includes("image")) return;
        
        var imgObj = img.getAsFile();
        var reader = new FileReader();

        reader.onload = async function (event: any) {
            const base64String = event.target.result;
            const height = await calculateHeight(base64String, 117)
            
            setImgData({ base64String, height }); 
        }
        
        reader.readAsDataURL(imgObj);
    }

    const calculateHeight = (imageBase64: string, desiredWidth: number): Promise<number> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = imageBase64;
        
            img.onload = () => {
                const aspectRatio = img.width / img.height;
                const calculatedHeight = desiredWidth / aspectRatio;
                resolve(calculatedHeight);
            };
        
            img.onerror = (error) => {
                reject(new Error("Failed to load image"));
            };
        });
    };

    const handleClickPaste = () => {
        // Focus the hidden textarea so user can paste
        const hiddenTextarea = document.getElementById("hidden-textarea") as HTMLTextAreaElement;
        hiddenTextarea?.focus();
    };

    return (
        <div className='w-full h-full relative'>
            <div 
                className='absolute w-6 h-6 p-1 top-0 right-0 bg-black cursor-pointer'
                onClick={() => setImgData({ base64String: '', height: 0 })}
            >
                <img src="../icons/trash.svg" alt="" className='w-full h-full' />
            </div>
            <p className='pb-2'>Imagen:</p>
            <div
                className={`${focused && "border border-black"} relative w-full mb-10 h-auto min-h-48 bg-white rounded-md flex items-center justify-center`}
            >
                {imgData ? <img src={imgData} className='rounded-md' /> :
                <textarea
                    id="hidden-textarea"
                    value={""}
                    onPaste={pasteImg}
                    onClick={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    className={`${focused && "border border-black"} absolute w-full h-full bg-white rounded-md flex items-center justify-center`}
                />}
            </div>
        </div>
    )
}

export default ImgContainer