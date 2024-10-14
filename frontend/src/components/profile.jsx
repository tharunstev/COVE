// eslint-disable-next-line no-unused-vars
import React from 'react'
import { Avatar, AvatarImage } from './ui/avatar'
import Usegetuserprofile from '@/hooks/usegetuserprofile'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Profile = () => {
  const params=useParams();
  const userId=params.id;
  Usegetuserprofile(userId);
  const {userProfile}=useSelector((store)=>store.who)
  
  
  
  return (
    <div>
      <Avatar>
        <AvatarImage src={userProfile?.profilePicture} alt/>
      </Avatar>
    </div>
  )
}

export default Profile
