import useUploadModal from "@/hooks/useUploadModal"
import Modal from "./Modal"
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import Input from "./Input";
import Button from "./Button";
import toast from "react-hot-toast";
import { useUser } from "@/hooks/useUser";
import uniqid from 'uniqid'
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";



const UploadModal = () => {
  const [isLoading, setisLoading] = useState(false)
  const uploadModal = useUploadModal();

  const {user} = useUser()
  const supabaseClient = useSupabaseClient()

  const router = useRouter()

  const { register, handleSubmit, reset } = useForm<FieldValues>({
    defaultValues: {
        author: '',
        title: '',
        song: null,
        image: null,
    }
  })

  const onChange  = (open: boolean) => {
         if (!open) {
              reset()
              uploadModal.onClose()          
         }
  }

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    // upload to supabase
    try {
      setisLoading(true);
      const imageFile = values.image?.[0];
      const songFile = values.song?.[0];
      
      

      if (!imageFile || !songFile || !user) {
           console.log(`imagefile:${imageFile}`, `songFile:${songFile}`, `user:${user}`);
           toast.error("Missing fields!")
           return;
       }

       const uniqueID = uniqid()
       // upload song
       const {data: songData, error: songError} = await supabaseClient.storage.from('songs').upload(`song-${values.title}-${uniqueID}`, songFile, {
          cacheControl: "3600",
          upsert: false
       })

       if(songError) {
         setisLoading(false);
         return toast.error('Failed song upload!')
        }

       const {data: imageData, error: imageError} = await supabaseClient.storage.from('images').upload(`image-${values.title}-${uniqueID}`, imageFile, {
        cacheControl: "3600",
        upsert: false
       })

       if (imageError) {
          setisLoading(false);
          return toast.error('Failed Image Upload.')
       }
       
       const {error: supabaseError} = await supabaseClient.from('songs').insert({user_id: user.id, title:values.title, author: values.author, image_path:imageData.path, song_path: songData.path})

       if (supabaseError) {
           setisLoading(false);
           return toast.error(supabaseError.message)
       }
       router.refresh();
       setisLoading(false);
       toast.success('Song Created!');
       reset();
       uploadModal.onClose()

    } catch (error) {
      toast.error('smoething gone wrong!')
    } finally{
       setisLoading(false)
    }
     
  }


  return (
     <Modal title="Add a Song" isOpen={uploadModal.isOpen} description="Upload a Mp3 file" onChange={onChange}>
          <form className="flex flex-col gap-y-4" onSubmit={handleSubmit(onSubmit)}>
              <Input id="title" disabled={isLoading} {...register('title', {required: true})} placeholder="Song title"  />
              <Input id="author" disabled={isLoading} {...register('author', {required: true})} placeholder="Song author"  />
              <div>
                  <div className="pb-1">
                     Select a song file
                  </div>
                  <Input id="song" type="file" disabled={isLoading} {...register('song', {required: true})} accept=".mp3" />   
              </div>
              <div>
                  <div className="pb-1">
                     Select an Image song
                  </div>
                  <Input id="image" type="file" disabled={isLoading} {...register('imagr', {required: true})} accept="image/*" />   
              </div>
              <Button type="submit" disabled={isLoading}>Create</Button>
          </form>
     </Modal>
  )
}

export default UploadModal