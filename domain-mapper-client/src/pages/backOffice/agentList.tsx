import React, { useRef, useState } from 'react'
import { Button, Table, Tag, Input, InputRef, Space, } from 'antd';
import type { ColumnsType, ColumnType } from 'antd/es/table';
import { SearchOutlined } from "@ant-design/icons"
import styles from "@/styles/backOffice.module.css"
import moment from 'moment';
import type { FilterConfirmProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';

interface DataType {
    id: string;
    siteName: string;
    date: string;
    agentDomain: string;
}

type DataIndex = keyof DataType

const AgentList = ({ list }: any) => {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef<InputRef>(null);

    const handleSearch = (
        selectedKeys: string[],
        confirm: (param?: FilterConfirmProps) => void,
        dataIndex: DataIndex,
      ) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
      };
    
      const handleReset = (clearFilters: () => void) => {
        clearFilters();
        setSearchText('');
      };

    const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<DataType> => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({ closeDropdown: false });
                            setSearchText((selectedKeys as string[])[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered: boolean) => (
            <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                .toString()
                .toLowerCase()
                .includes((value as string).toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });
    
    
const columns: ColumnsType<DataType> = [
    {
        title: 'Name',
        dataIndex: 'siteName',
        key: 'id',
        render: (text) => <a>{text}</a>,
        ...getColumnSearchProps('siteName'),
    },
    {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
        render: d => <div>{moment(d).format("DD/MM/YYYY")}</div>,

    },
    {
        title: 'Site',
        key: 'agentDomain',
        dataIndex: 'agentDomain',
        render: (agent) => (
            <>
                <Tag color="blue" key={agent}>
                    {agent.toUpperCase()}
                </Tag>
            </>
        ),
        ...getColumnSearchProps('agentDomain'),
    },
    {
        title: 'Action',
        key: 'action',
        render: (_, record) => (
            <Button>
                <a>Invite {record.siteName}</a>
            </Button>
        ),
    },
];

    return (
        <div className={styles.container}>
            <div className={styles.flex}>
                <h3>Sub Agent List</h3>
                {/* <Input style={{ width: "40%" }} prefix={<SearchOutlined />} placeholder="Search agents" /> */}
            </div>
            <Table columns={columns} dataSource={list} />
        </div>
    )
}

export default AgentList