/* eslint-disable react-hooks/exhaustive-deps */
import { memo, ReactNode, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const IsAuthenticated = ({children}: {children: ReactNode}) => {
    const navigate = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem('adminToken')
        if (!token) {
            navigate('/login');
        }
    }, [])

    return (
        <>
            {children}
        </>
    )
}

export default memo(IsAuthenticated)