
export const useFile = () => {
  
  const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });
    }

    const onFileChange = (event: React.ChangeEvent<HTMLInputElement>, setSelectedFile: any) => {
        const file = event.target.files?.[0];
        console.log(file)
        if( file && (file.type === 'application/pdf' || file.type === 'image/jpeg')) {
        setSelectedFile( file );
        } else if( file ) {
        alert('Formato de archivo no permitido.')
        }
        event.target.value = '';
	};

    return {
        fileToBase64,
        onFileChange
    }
}
