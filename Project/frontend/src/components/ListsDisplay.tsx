import React, { useState, useEffect } from 'react'
import { useAuth } from '@clerk/clerk-react'
import { getAllMailingLists } from '../api/mailService'
import ListWithProps from '../components/ListWithProps.tsx'
import { MailingList } from '../../../shared/types/Types'

export default function ListsDisplay() {
    const [lists, setList] = useState<MailingList[]>([])
    const [visible, setVisible] = useState(false)
    const [listByName, setListByName] = useState<string[]>([])
    const [selectedList, setSelectedList] = useState<string[]>([]);
    const [listVisible, setListVisible] = useState(false)
    const [oneListVisible, setOneListVisible] = useState(false)
    const [collapsed, setCollapsed] = React.useState(false)
    // const [listByName, setListByName] = useState<string[]>([])

    const getToken = useAuth().getToken;


    const handleDisplayListsByName = async () => {

        try {
            const token = await getToken();
            const mailingList = await getAllMailingLists(token);
            setList(mailingList);
        } catch (error) {
            console.log('Error fetching mailing lists by name:', error);
        }

        setVisible(!visible)

    }

    if (lists === null) {
        return <div>Loading...</div>;
    }

    // when clicked, we will fetch the specific emails inside that list, and render them
    //

    const handleDisplayIndividualList = (list: MailingList) => {
        const { emails } = list

        setSelectedList(emails);
        setOneListVisible(!oneListVisible)
    }

    return (
        <>
            <div>
                <button onClick={handleDisplayListsByName}>See all lists</button>
                {visible && (
                    <ul>
                        {lists.map((lists) => (
                            <li key={lists.id} >
                                <button onClick={() => handleDisplayIndividualList(lists)}>{lists.name}</button>
                                {
                                    listVisible && (
                                        <ul>
                                            {selectedList.map((list) => (

                                                <li key={lists.id}>
                                                    {lists.emails}

                                                </li>

                                            ))

                                            }

                                        </ul>
                                    )
                                }
                            </li>
                        ))}
                    </ul>

                )}
                {/* {selectedList && <ListWithProps mailingList={selectedList} />} */}
            </div>
        </>
    )
}