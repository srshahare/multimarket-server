import React, { useEffect, useState } from 'react'
import styles from '@/styles/agentSite.module.css'
import { Input, Button, Modal, message } from 'antd'
import { useRouter } from 'next/router'
import axios from 'axios'
import baseUrl from '@/utils/baseUrl'

const AgentHome = ({ auth, setAuth, user }: any) => {

  const router = useRouter();

  const [isEcom, setIsEcom] = useState<any>(null)
  const [isAgent, setIsAgent] = useState<any>(null)
  const [eCom, setECom] = useState("")
  const [agent, setAgent] = useState("")
  const [isAgentModal, setAgentModalOpen] = useState(false)
  const [isEcomModal, setEcomModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleCancel = () => {
    setAgentModalOpen(false)
    setEcomModalOpen(false)
  }

  const handleAgentOk = async () => {
    if (agent !== "") {
      setLoading(true)
      try {
        const token = localStorage.getItem("token")
        const result = await axios({
          method: "post",
          url: baseUrl + "/agent/createSite",
          headers: { Authorization: `Bearer ${token}` },
          data: {
            siteName: agent
          }
        })
        if (result.data) {
          console.log(result)
          const { agentDomain, officeDomain } = result.data?.data;
          setIsAgent({ agentDomain, officeDomain })
        }
      } catch (err: any) {
        console.log(err)
        setLoading(false)
        return message.error({
          content: err.message
        })
      }
      setLoading(false)
      setAgentModalOpen(false)
    }
  }

  const handleEcomOk = async () => {
    if (eCom !== "") {
      setLoading(true)
      try {
        const token = localStorage.getItem("token")
        const result = await axios({
          method: "post",
          url: baseUrl + "/sales/createSite",
          headers: { Authorization: `Bearer ${token}` },
          data: {
            siteName: eCom
          }
        })
        if (result.data) {
          console.log(result)
          const { eComDomain, customerDomain } = result.data?.data;
          setIsEcom({ eComDomain, customerDomain })
        }
      } catch (err: any) {
        console.log(err)
        setLoading(false)
        return message.error({
          content: err.message
        })
      }
      setLoading(false)
      setEcomModalOpen(false)
    }
  }

  const handleLogout = () => {
    localStorage.setItem("token", "")
    setAuth(false)
  }

  useEffect(() => {

    async function fetchAgentSite() {
      try {
        const token = localStorage.getItem("token")
        const result = await axios({
          method: "get",
          url: baseUrl + "/agent/getSite",
          headers: {Authorization: `Bearer ${token}`}
        })
        if(result.data) {
          const { agentDomain, officeDomain } = result.data?.data;
          setIsAgent({
            agentDomain,
            officeDomain
          })
        }
      } catch (err) {
        console.log(err)
      }
    }
    async function fetchSalesSite() {
      try {
        const token = localStorage.getItem("token")
        const result = await axios({
          method: "get",
          url: baseUrl + "/sales/getSite",
          headers: {Authorization: `Bearer ${token}`}
        })
        console.log(result)
        if(result.data) {
          const { customerDomain, eComDomain } = result.data?.data;
          setIsEcom({
            customerDomain,
            eComDomain
          })
        }
      } catch (err) {
        console.log(err)
      }
    }

    fetchAgentSite();
    fetchSalesSite();
  }, [])

  return (
    <div className={styles.container}>
      <div className={styles.homeCard}>
        <h3>Account Page</h3>
        <div style={{ marginTop: '1rem' }}>
          <p style={{ marginBottom: '8px' }}>Email</p>
          <Input value={user?.email} contentEditable={false} />
        </div>
        <div style={{ marginTop: '2rem' }}>
          <h5>E-Commerce</h5>
          {
            isEcom ?
              <div style={{ marginTop: "1rem" }}>
                <p style={{ marginLeft: '8px', fontSize: '.9rem' }}>{eCom} site was created</p>
                <p style={{ marginTop: '1rem' }}>Your <span style={{ color: "rgb(255, 150, 63)" }}>E-Commerce</span> temporary domain</p>
                <div style={{ display: 'flex', columnGap: '1rem', marginTop: "8px" }}>
                  <div style={{ border: '3px dashed rgb(255, 150, 63)', padding: '4px 1rem', borderRadius: '8px' }}>
                    <p>{isEcom?.eComDomain}</p>
                  </div>
                  <Button onClick={() => window.open(`https://${isEcom?.eComDomain}`, "_blank")} style={{ background: "rgb(255, 150, 63)", color: 'white', fontWeight: 'bold' }}>Go
                  </Button>
                </div>
                <p style={{ marginTop: '1rem' }}>Your <span style={{ color: "rgb(255, 150, 63)" }}>Customer service</span> site</p>
                <div style={{ display: 'flex', columnGap: '1rem', marginTop: "8px" }}>
                  <div style={{ border: '3px dashed rgb(255, 150, 63)', padding: '4px 1rem', borderRadius: '8px' }}>
                    <p>{isEcom?.customerDomain}</p>
                  </div>
                  <Button onClick={() => window.open(`https://${isEcom?.customerDomain}`, "_blank")} style={{ background: "rgb(255, 150, 63)", color: 'white', fontWeight: 'bold' }}>Go
                  </Button>
                </div>
              </div> :
              <Button onClick={() => setEcomModalOpen(true)} style={{ marginTop: '1rem' }} type="primary">Create E-Commerce</Button>
          }
        </div>
        <div style={{ marginTop: '2rem' }}>
          <h5>Agent (MLM)</h5>
          {
            isAgent ?
              <div style={{ marginTop: "1rem" }}>
                <p style={{ marginLeft: '8px', fontSize: '.9rem' }}>{agent} Agent was created</p>
                <p style={{ marginTop: '1rem' }}>Your <span style={{ color: "rgb(255, 150, 63)" }}>Agent Site</span> temporary domain</p>
                <div style={{ display: 'flex', columnGap: '1rem', marginTop: "8px" }}>
                  <div style={{ border: '3px dashed rgb(255, 150, 63)', padding: '4px 1rem', borderRadius: '8px' }}>
                    <p>{isAgent?.agentDomain}</p>
                  </div>
                  <Button onClick={() => window.open(`https://${isAgent?.agentDomain}`, "_blank")} style={{ background: "rgb(255, 150, 63)", color: 'white', fontWeight: 'bold' }}>Go
                  </Button>
                </div>
                <p style={{ marginTop: '1rem' }}>Your <span style={{ color: "rgb(255, 150, 63)" }}>Back-Office</span> site</p>
                <div style={{ display: 'flex', columnGap: '1rem', marginTop: "8px" }}>
                  <div style={{ border: '3px dashed rgb(255, 150, 63)', padding: '4px 1rem', borderRadius: '8px' }}>
                    <p>{isAgent?.officeDomain}</p>
                  </div>
                  <Button onClick={() => window.open(`https://${isAgent?.officeDomain}`, "_blank")} style={{ background: "rgb(255, 150, 63)", color: 'white', fontWeight: 'bold' }}>Go
                  </Button>
                </div>
              </div> :
              <Button onClick={() => setAgentModalOpen(true)} style={{ marginTop: '1rem', background: "rgb(69, 108, 180, 0.8)" }} type="primary">Create Agent</Button>
          }
        </div>
        <Button onClick={handleLogout} style={{ marginTop: '3rem' }}>Logout</Button>
      </div>
      <Modal confirmLoading={loading} title="Agent" open={isAgentModal} onOk={handleAgentOk} onCancel={handleCancel}>
        <p style={{ marginBottom: '8px' }}>Agent Name</p>
        <Input onChange={e => setAgent(e.target.value)} placeholder='agent name' />
      </Modal>
      <Modal confirmLoading={loading} title="E-Commerce" open={isEcomModal} onOk={handleEcomOk} onCancel={handleCancel}>
        <p style={{ marginBottom: '8px' }}>Site Name</p>
        <Input onChange={e => setECom(e.target.value)} placeholder='site name' />
      </Modal>
    </div>
  )
}

export default AgentHome