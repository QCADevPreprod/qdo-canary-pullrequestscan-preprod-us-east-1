package xml

import org.apache.xmlrpc.client.XmlRpcClientConfigImpl
import org.apache.xmlrpc.server.XmlRpcServerConfigImpl

object ApacheXmlRpc {
  def createClientAndServerConfigs(): Unit = {
    val serverCfg = new XmlRpcServerConfigImpl
    val clientCfg = new XmlRpcClientConfigImpl
    val trueValue = true
    // ruleid: scala-rpc-ApacheXml
    clientCfg.setEnabledForExtensions(true) // BAD
    // ruleid: scala-rpc-ApacheXml
    clientCfg.setEnabledForExtensions(trueValue)
    // ruleid: scala-rpc-ApacheXml
    serverCfg.setEnabledForExtensions(true)
    // ruleid: scala-rpc-ApacheXml
    serverCfg.setEnabledForExtensions(trueValue)

    val falseValue = false
    // ok: scala-rpc-ApacheXml
    clientCfg.setEnabledForExtensions(false) // GOOD
    // ok: scala-rpc-ApacheXml
    clientCfg.setEnabledForExtensions(falseValue)
    // ok: scala-rpc-ApacheXml
    serverCfg.setEnabledForExtensions(false)
    // ok: scala-rpc-ApacheXml
    serverCfg.setEnabledForExtensions(falseValue)
    
  }
}
