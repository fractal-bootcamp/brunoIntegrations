import React, { useState } from 'react'
import BlastDisplay from '../components/BlastDisplay'
import ListsDisplay from '../components/ListsDisplay'
import ListWithProps from '../components/ListWithProps'
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';

export default function MailingListManager() {
    // const [blast, setBlast] = useState<Object>({})
    const [list, setList] = useState<Object>({})

    return (
        <>
            <Sidebar>
                <Menu>
                    <SubMenu label="Mailing lists" component="ListsDisplay">
                        <ListsDisplay />
                    </SubMenu>
                    <SubMenu label="Blasts" component="BlastDisplay">
                    </SubMenu>
                </Menu>
            </Sidebar>

        </>
    )
}