import React, { memo } from 'react'

import styles from './Paper.module.scss'

export const Paper = memo(({ children }) => <div className={styles.paper}>{children}</div>)