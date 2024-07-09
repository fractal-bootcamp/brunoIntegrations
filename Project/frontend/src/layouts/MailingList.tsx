import React, { useState } from 'react'
import BlastDisplay from '../components/BlastDisplay'

export default function MailingListManager() {
    const [blast, setBlast] = useState<Object>({})

    return (
        <>
            <div className="">

            </div>
            <div className="">
                <BlastDisplay />
            </div>
        </>
    )
}