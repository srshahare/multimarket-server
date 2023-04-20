import React, { useEffect, useState } from 'react'
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import { useRouter } from 'next/router';
import AgentList from './agentList';
import General from './general';
import CustomDomain from './customDomain';
import Profile from './profile';
import axios from 'axios';
import baseUrl from '@/utils/baseUrl';

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  // getItem('Sub Agent List', 'agentList', <PieChartOutlined />),
  getItem('Settings', 'sub1', <UserOutlined />, [
    getItem('General', 'general'),
    // getItem('Custom Domains', 'customDomains'),
  ]),
  getItem('Profile', 'profile', <PieChartOutlined />),
  getItem('Logout', 'logout', <PieChartOutlined />),
];

const CustomerHome = ({ member }: any) => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const router = useRouter();
  const [key, setKey] = useState("general")
  const [downlineList, setDownlineList] = useState([])
  const [site, setSite] = useState(null)

  const handleMenuClick = (e: any) => {
    const key = e.key
    setKey(key)
    if (key === 'logout') {
      localStorage.setItem("mtoken", "")
      router.reload()
    }
  }

  useEffect(() => {
    async function getCustomerSite() {
      try {
        const token = localStorage.getItem("mtoken")
        const site = await axios({
          method: "GET",
          url: baseUrl + "/member/getMember",
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        if (site.data) {
          setSite(site.data?.data)
        }
      } catch (err) {
        console.log(err)
      }
    }

    async function getSalesSite() {
      try {
        const token = localStorage.getItem("mtoken")
        const site = await axios({
          method: "GET",
          url: baseUrl + "/sales/getSite",
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (site.data) {
          console.log(site)
          // setSite(site.data?.data)
        }
      } catch (err) {
        console.log(err)
      }
    }
    getSalesSite()
    getCustomerSite();
  }, [])

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <h3 style={{ color: 'white' }}>Customer Service</h3>
        </div>
        <Menu onClick={handleMenuClick} theme="dark" defaultSelectedKeys={['sub1']} defaultOpenKeys={['sub1']} mode="inline" items={items} />
      </Sider>
      <Layout className="site-layout">
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content style={{ margin: '16px' }}>
          <div style={{ padding: 24, minHeight: 640, background: colorBgContainer, justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
            {key === 'customDomains' &&
              <CustomDomain site={site} />
            }
            {key === "general" &&
              <General site={site} />
            }
            {key === "agentList" &&
              <AgentList list={downlineList} />
            }
            {key === "profile" &&
              <Profile site={site} />
            }
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}

export default CustomerHome