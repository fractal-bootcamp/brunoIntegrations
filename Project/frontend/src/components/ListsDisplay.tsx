import React, { useState, useEffect } from 'react'
import { useAuth } from '@clerk/clerk-react'
import { getAllMailingLists } from '../api/mailService'
import ListWithProps from '../components/ListWithProps.tsx'
import { MailingList } from '../../../shared/types/Types'

export default function ListsDisplay() {
    const [list, setList] = useState<MailingList[]>([])

    const getToken = useAuth().getToken;

    useEffect(() => {
        const fetchedData = async () => {

            try {

                const token = await getToken();
                const mailingList = await getAllMailingLists(token);
                setList(mailingList);
            }
            catch (error) {
                console.log('Error fetching mailing lists:', error);
            }


        }

        fetchedData();

    }, [getToken])


    if (list === null) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <div>

                {list.map((item) => (
                    <ListWithProps key={item.id} mailingList={item} />
                ))}

            </div>
        </>
    )
}