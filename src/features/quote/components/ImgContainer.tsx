import React from 'react'

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

    return (
        <div className='w-full h-full'>
            <p className='pb-2'>Imagen:</p>
            <div
                className={`${focused && "border border-black"} w-full h-full min-h-48 bg-white rounded-md flex items-center justify-center`}
                onPaste={pasteImg}
                onClick={() => setFocused(true)}
                onBlur={() => setFocused(false)}
            >
                <img src={imgData} />
            </div>
        </div>
    )
}

export default ImgContainer