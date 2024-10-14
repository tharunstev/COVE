// eslint-disable-next-line no-unused-vars
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

const Comments = ({comment}) => {
  return (
    <div className='my-2'>
      <div>
        <Avatar>
            <AvatarImage  src={comment?.author?.profilePicture}  />
            <AvatarFallback>CN</AvatarFallback>
        </Avatar>
         <h1 className='font-medium text-sa' >{comment?.author.username} <span className='font-normal pl-1'>{comment?.text}</span> </h1>
      </div>
    </div>
  )
}

export default Comments

