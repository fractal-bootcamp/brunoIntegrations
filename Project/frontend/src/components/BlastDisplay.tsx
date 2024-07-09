import React, { useState, useEffect } from 'react'
import { getAllBlasts } from '../api/mailService'
import { useAuth } from '@clerk/clerk-react'

export default function BlastDisplay() {
    const [list, setList] = useState<string[]>([])

    const { getToken } = useAuth()

    useEffect(() => {
        const fetchedData = async () => {

            try {
                const token = await getToken();
                const blasts = await getAllBlasts(token);
                setList(blasts);
            } catch (error) {
                console.error('Error fetching blasts:', error);

            }

        };

        fetchedData();
    }, [getToken]);


    if (list === null) {
        return <div>Loading...</div>;
    }


    return (

        <div>
            <ol>
                {list.map((item, index) => (
                    <li key={index}>{JSON.stringify(item)}</li>
                ))}
            </ol>
        </div>
    )
}