import { useRouter } from 'next/router'
import React from 'react'
import Layout from '../components/Layout'

const Unnauthorized = () => {
    const router = useRouter()
    const { message } = router.query
    return (
        <Layout title="unauthorized">
            <h1>Access denied</h1>
            {message && <h2 className='text-red-500 uppercase'>{message}</h2>}
        </Layout>
    )
}

export default Unnauthorized
