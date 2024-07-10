import React, { useState, useEffect } from 'react'
import { useAuth } from '@clerk/clerk-react'
import { getAllMailingLists } from '../api/mailService'
import ListWithProps from '../components/ListWithProps.tsx'
import { MailingList } from '../../../shared/types/Types'

export default function ListsDisplay() {
    const [list, setList] = useState<MailingList[]>([])
    const [visible, setVisible] = useState(false)
    const [listByName, setListByName] = useState<string[]>([])
    // const [listByName, setListByName] = useState<string[]>([])

    const getToken = useAuth().getToken;

    // useEffect(() => {
    //     const fetchedData = async () => {

    //         try {

    //             const token = await getToken();
    //             const mailingList = await getAllMailingLists(token);
    //             setList(mailingList);
    //         }
    //         catch (error) {
    //             console.log('Error fetching mailing lists:', error);
    //         }


    //     }

    //     fetchedData();

    // }, [getToken])

    // const handleDisplayAllList = async () => {


    //     try {

    //         const token = await getToken();
    //         const mailingList = await getAllMailingLists(token);
    //         setList(mailingList);
    //     }
    //     catch (error) {
    //         console.log('Error fetching mailing lists:', error);
    //     }

    //     setVisible(!visible)

    // }


    const handleDisplayListsByName = async () => {

        try {
            const token = await getToken();
            const mailingList = await getAllMailingLists(token);
            setList(mailingList.name);
        } catch (error) {
            console.log('Error fetching mailing lists by name:', error);
        }

        setVisible(!visible)
    }

    if (list === null) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <div>
                <button onClick={handleDisplayListsByName}>See all lists</button>
                {visible && (
                    <div>
                        {list.map((item) => (
                            <ListWithProps key={item.id} mailingList={item} />
                        ))}
                    </div>

                )}
            </div>
        </>
    )
}