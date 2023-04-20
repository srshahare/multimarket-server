import React from 'react'
import { Button, Table, Tag, Input } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SearchOutlined } from "@ant-design/icons"
import styles from "@/styles/backOffice.module.css"


interface DataType {
    key: string;
    name: string;
    date: string;
    tags: string[];
}

const columns: ColumnsType<DataType> = [
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: (text) => <a>{text}</a>,
    },
    {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
    },
    {
        title: 'Sites',
        key: 'tags',
        dataIndex: 'tags',
        render: (_, { tags }) => (
            <>
                {tags.map((tag, i) => {
                    let color = tag.length > 5 ? 'geekblue' : 'green';
                    if (i > 0) {
                        color = 'volcano';
                    }
                    return (
                        <Tag color={color} key={tag}>
                            {tag.toUpperCase()}
                        </Tag>
                    );
                })}
            </>
        ),
    },
    {
        title: 'Action',
        key: 'action',
        render: (_, record) => (
            <Button>
                <a>Invite {record.name}</a>
            </Button>
        ),
    },
];

const data: DataType[] = [
    {
        key: '1',
        name: 'Katena',
        date: '12/05/2023',
        tags: ['www.katena.com'],
    },
    {
        key: '2',
        name: 'MonoBlue',
        date: '14/15/2023',
        tags: ['www.monoblue.com', 'www.monoblueshop.com'],
    },
    {
        key: '3',
        name: 'ZooFast',
        date: '08/04/2023',
        tags: ['www.zoofast.com'],
    },
];


const AgentList = ({site}: any) => {
    return (
        <div className={styles.container}>
            <div className={styles.flex}>
                <h3>Sub Agent List</h3>
                <Input style={{ width: "40%" }} prefix={<SearchOutlined />} placeholder="Search agents" />
            </div>
            <Table columns={columns} dataSource={data} />
        </div>
    )
}

export default AgentList