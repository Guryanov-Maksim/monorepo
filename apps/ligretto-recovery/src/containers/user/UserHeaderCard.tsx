import React from 'react'
import { useSelector } from 'react-redux'
import { selectUserProfile } from 'ducks/user/selectors'
import { UserHeaderCard } from 'components/blocks/user'

const UserHeaderCardContainer: React.FC = () => {
  const { username, avatar } = useSelector(selectUserProfile)

  return <UserHeaderCard username={username} avatar={avatar} />
}

export default UserHeaderCardContainer