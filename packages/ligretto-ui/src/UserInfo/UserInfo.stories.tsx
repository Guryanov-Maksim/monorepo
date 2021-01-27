import React from 'react'
import { UserInfo } from './UserInfo'

export default {
  title: 'MainUser',
  argTypes: {
    onClick: { action: 'clicked' },
    buttonText: { control: 'text', defaultValue: 'sign up' },
  },
}

export const DefaultView = args => <UserInfo {...args} />

export const Authorized = args => <UserInfo {...args} />

Authorized.argTypes = {
  onClick: { action: 'clicked' },
  username: { control: 'text', defaultValue: 'themezv' },
  buttonText: { control: 'text', defaultValue: 'sign up' },
  onButtonClick: { action: 'button clicked' },
}